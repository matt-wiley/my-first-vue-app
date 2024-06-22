import type Article from "@/models/article";
import type ArticleRecord from "@/models/articleRecord";
import type Source from "@/models/source";
import type { SourceRecord } from "@/models/sourceRecord";
import HashUtils, { HashAlgo } from "@/utils/hashUtils";
import StringUtils from "@/utils/stringUtils";
import { defineStore } from "pinia";

export const useInMemoryContentStore = defineStore({
  id: "content",

  state: () => ({
    sources: [],
    articles: [],
  }),

  getters: {
    getAllSources: (state) => state.sources,
    getSource: (state) => (sourceId: string | undefined) => {
      if (!sourceId) return undefined;
      return state.sources.find((s) => s.id === sourceId);
    },
    getAllArticles: (state) => state.articles,
    getArticles: (state) => {
      return state.articles.filter((a) => !a.isTombstoned);
    },
    getArticlesForSourceId: (state) => (sourceId: string) => {
      return state.articles
        .filter((a) => !a.isTombstoned)
        .filter((a) => a.sourceId === sourceId);
    },
    getArticle: (state) => (articleSha: string | undefined) => {
      if (!articleSha) return undefined;
      return state.articles.find((a) => a.id === articleSha);
    },
  },

  actions: {
    async addSource(source: Source): Promise<SourceRecord> {
      const sourceRecord = { ...source } as SourceRecord;
      if (StringUtils.isEmpty(sourceRecord.feedUrl)) {
        throw new Error("Feed URL is required");
      }
      // @ts-ignore Typescript doesn't know about the guard clause above
      const hash = await HashUtils.digest(HashAlgo.SHA1, sourceRecord.feedUrl);
      sourceRecord.id = `S-${hash}`;
      this.sources.push(sourceRecord);
      return sourceRecord;
    },
    async deleteSource(sourceRecord: SourceRecord) {
      const index = this.sources.indexOf(sourceRecord);
      if (index > -1) {
        this.sources.splice(index, 1);
      }
      const articles = this.articles.filter((a) => a.sourceId === sourceRecord.id);
      for (const article of articles) {
        this.deleteArticle(article);
      }
    },
    async deleteSourceById(sourceId: string) {
      const sourceRecord = this.sources.find((s) => s.id === sourceId);
      if (sourceRecord) {
        this.deleteSource(sourceRecord);
      }
    },
    async addArticle(sourceRecord: SourceRecord, article: Article): Promise<ArticleRecord> {
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
      this.articles.push(articleRecord);
      return articleRecord;
    },
    async deleteArticle(articleRecord: ArticleRecord) {
      if (articleRecord.freshness !== "Stale") {
        articleRecord.isTombstoned = true;
      }
      else {
        const index = this.articles.indexOf(articleRecord);
        if (index > -1) {
          this.articles.splice(index, 1);
        }
      }
    },
    async deleteArticleById(articleId: string) {
      const articleRecord = this.articles.find((a) => a.id === articleId);
      if (articleRecord) {
        this.deleteArticle(articleRecord);
      }
    },
  },
});
