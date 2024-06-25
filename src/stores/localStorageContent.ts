import type Article from "@/models/article";
import type ArticleRecord from "@/models/articleRecord";
import Freshness from "@/models/freshness";
import type ParsedFeed from "@/models/parsedFeed";
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

  const generateShaAndIdForArticle = async (sourceRecord: SourceRecord, article: Article) => {
    const sha = await HashUtils.digest(
      HashAlgo.SHA256,
      `${sourceRecord.id}${article.title}${article.link}`
    );
    const id = await HashUtils.digest(
      HashAlgo.SHA1,
      sha
    );
    return { sha, id };
  }


  return defineStore({
    id: "localStorageContent",

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
      // Testable Helpers
      async generateShaAndIdForArticle(sourceRecord: SourceRecord, article: Article) {
        const sha = await HashUtils.digest(
          HashAlgo.SHA256,
          `${sourceRecord.id}${article.title}${article.link}`
        );
        const id = await HashUtils.digest(
          HashAlgo.SHA1,
          sha
        );
        return { sha, id };
      },

      // Source Actions
      async addSourceKey(sourceKey: string): Promise<void> {
        this.sourcesKeys.push(sourceKey);
      },
      async addSource(source: Source): Promise<SourceRecord> {

        const existingSourceWithURL = this.getAllSources.find((s: SourceRecord) => s.feedUrl === source.feedUrl)
        if (existingSourceWithURL) {
          throw new Error("Found existing source with the same feed URL");
        }

        const sourceRecord = { ...source } as SourceRecord;
        if (StringUtils.isEmpty(sourceRecord.feedUrl)) {
          throw new Error("Feed URL is required");
        }
        // @ts-ignore
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

        const { sha, id } = await generateShaAndIdForArticle(sourceRecord, article);

        const existingArticleWithSha = this.getAllArticles.find((a: ArticleRecord) => a.sha === sha);
        if (existingArticleWithSha) {
          throw new Error("Found existing article with the same SHA");
        }

        const articleRecord = { ...article } as ArticleRecord;
        articleRecord.sourceId = sourceRecord.id;
        articleRecord.sha = sha;
        articleRecord.id = `A-${id}`;
        articleRecord.freshness = Freshness.New;
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
      async updateArticleFreshness(id: string, freshness: Freshness) {
        const articleRecord = this.getArticle(id);
        if (articleRecord) {
          articleRecord.freshness = freshness;
          this.entities = { ...this.entities, [articleRecord.id]: articleRecord };
        }
      },
      async deleteArticleById(articleId: string) {
        const articleRecord = this.getArticle(articleId);
        if (articleRecord) {
          this.deleteArticle(articleRecord);
        }
      },

      async refreshFeed(parsedFeedForSource: ParsedFeed): Promise<void> {
        const articleShasFromRefresh = new Set<string>();

        const existingSource = this.getAllSources.find((s: SourceRecord) => s.feedUrl === parsedFeedForSource.source.feedUrl);
        if (!existingSource) {
          throw new Error("Existing source not found: " + parsedFeedForSource.source.feedUrl);
        }
        
        for (const article of parsedFeedForSource.articles) {
          
          let articleRecord: ArticleRecord | undefined = undefined;
          try {
           articleRecord = await this.addArticle(existingSource, article);
          }
          catch (error: any) {
            if (error.message === "Found existing article with the same SHA") {
              const { id } = await generateShaAndIdForArticle(existingSource, article);
              articleRecord = this.getArticle(id)
              if (articleRecord) {
                await this.updateArticleFreshness(articleRecord.id, Freshness.Current);
              }
            }
          }

          if (articleRecord) articleShasFromRefresh.add(articleRecord!.sha);
        }

        const articlesAfterRefresh: ArticleRecord[] = this.getArticlesForSourceId(existingSource.id);
        for (const articleRecord of articlesAfterRefresh) {
          if (!articleShasFromRefresh.has(articleRecord.sha)) {
            await this.updateArticleFreshness(articleRecord.id, Freshness.Stale);
          }
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