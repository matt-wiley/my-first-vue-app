import type ArticleRecord from "@/models/articleRecord";
import type Source from "@/models/source";
import type SourceRecord from "@/models/sourceRecord";
import HashUtils, { HashAlgo } from "@/utils/hashUtils";
import StringUtils from "@/utils/stringUtils";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

type ContentEntries = { [key: string]: ContentEntry }
type ContentEntry = SourceRecord | ArticleRecord;

const _contentStoreDefinition = (() => {

  const KEY_SOURCE_IDS_LIST: string = "mfva-rss.content.sourceIdsList";
  const KEY_ARTICLE_IDS_LIST: string = "mfva-rss.content.articleIdsList";
  const KEY_CONTENT_ENTRIES: string = "mfva-rss.content.entries";

  return defineStore({
    id: "content",

    hydrate: (currentState: any) => {
      currentState.sourcesKeys = useLocalStorage<string[]>(KEY_SOURCE_IDS_LIST, []);
      currentState.articlesKeys = useLocalStorage<string[]>(KEY_ARTICLE_IDS_LIST, []);
      currentState.entities = useLocalStorage<ContentEntries>(KEY_CONTENT_ENTRIES, {} as ContentEntries)
    },

    state: () => ({
      sourcesKeys: useLocalStorage<string[]>(KEY_SOURCE_IDS_LIST, []),
      articlesKeys: useLocalStorage<string[]>(KEY_ARTICLE_IDS_LIST, []),
      entities: useLocalStorage<ContentEntries>(KEY_CONTENT_ENTRIES, {} as ContentEntries)
    }),

    getters: {
      getAllSources: (state) => {
        return state.sourcesKeys.map((key: any) => state.entities[key]);
      },
      getAllArticles: (state) => {
        return state.articlesKeys.map((key: any) => state.entities[key]);
      },
      getArticles: (state) => {
        return state.articlesKeys
          .map((key: any) => state.entities[key])
          .filter((a: ArticleRecord) => !a.isTombstoned);
      },
      getArticlesForSourceId: (state) => (sourceId: string) => {
        return state.articlesKeys
          .map((key: any) => state.entities[key])
          .filter((a: ArticleRecord) => a.sourceId === sourceId && !a.isTombstoned);
      },
      getArticle: (state) => (articleId: string | undefined) => {
        if (!articleId) return undefined;
        return state.entities[articleId]
      },
      getSource: (state) => (sourceId: string | undefined) => {
        if (!sourceId) return undefined;
        return state.entities[sourceId];
      },
    },

    actions: {

      // Source Actions
      async addSourceKey(sourceKey: string): Promise<void> {
        this.sourcesKeys.push(sourceKey);
      },
      async addSource(source: Source): Promise<SourceRecord> {
        const sourceRecord = { ...source } as SourceRecord;
        if (StringUtils.isEmpty(sourceRecord.feedUrl)) {
          throw new Error("Feed URL is required");
        }
        const hash = await HashUtils.digest(HashAlgo.SHA1, sourceRecord.feedUrl);
        sourceRecord.id = `S-${hash}`;

        this.addSourceKey(sourceRecord.id);
        
        this.entities = { ...this.entities, [sourceRecord.id]: sourceRecord };
        return sourceRecord;
      },
      async deleteSource(sourceRecord: SourceRecord) {
        const index = this.sourcesKeys.indexOf(sourceRecord.id);
        if (index > -1) {
          this.sourcesKeys.splice(index, 1);
        }
        const articles = this.getArticlesForSourceId(sourceRecord.id);
        for (const article of articles) {
          this.deleteArticle(article);
        }
      },
      async deleteSourceById(sourceId: string) {
        const sourceRecord = this.getSource(sourceId);
        if (sourceRecord) {
          this.deleteSource(sourceRecord);
        }
      },

      // Article Actions
      async addArticleKey(articleKey: string): Promise<void> {
        this.articlesKeys.push(articleKey);
      },
      async addArticle(sourceRecord: SourceRecord, article: ArticleRecord): Promise<ArticleRecord> {
        const articleRecord = { ...article } as ArticleRecord;
        articleRecord.sourceId = sourceRecord.id;

        const sha = await HashUtils.digest(
          HashAlgo.SHA256,
          `${articleRecord.sourceId}${articleRecord.title}${articleRecord.link}`
        );
        const id = await HashUtils.digest(
          HashAlgo.SHA1,
          sha
        );
        articleRecord.sha = sha;
        articleRecord.id = `A-${id}`;
        this.addArticleKey(articleRecord.id);

        this.entities = { ...this.entities, [articleRecord.id]: articleRecord };
        return articleRecord;
      },
      async deleteArticle(articleRecord: ArticleRecord) {
        if (articleRecord.freshness !== "Stale") {
          articleRecord.isTombstoned = true;
        }
        else {
          delete this.entities[articleRecord.id];
          this.articlesKeys.splice(this.articlesKeys.indexOf(articleRecord.id), 1);
        }
      },
      async deleteArticleById(articleId: string) {
        const articleRecord = this.getArticle(articleId);
        if (articleRecord) {
          this.deleteArticle(articleRecord);
        }
      },

      
      async clearAll() {
        this.sourcesKeys = [];
        this.articlesKeys = [];
        this.entities = {};
      },

    }

  });

})();


export const useLocalStorageContentStore = _contentStoreDefinition