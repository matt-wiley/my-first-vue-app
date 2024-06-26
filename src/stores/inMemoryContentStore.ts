import type ArticleEntity from "@/models/articleEntity";
import Freshness from "@/models/freshness";
import type SourceEntity from "@/models/sourceEntity";
import type ContentStoreInterface from "@/stores/contentStoreInterface";
import type { Maybe } from "@/types/maybe";
import HashUtils, { HashAlgo } from "@/utils/hashUtils";
import ValidationUtils from "@/utils/validationUtils";
import { defineStore } from "pinia";



class ContentStoreUtils {

  static async generateSourceId(source: Partial<SourceEntity>): Promise<string> {
    if (ValidationUtils.isEmptyString(source.feedUrl)) {
      throw new Error("source.feedUrl cannot be null or undefined");
    }
    return `S-${await HashUtils.digest(HashAlgo.SHA1, source.feedUrl!)}`
  }


  static async generateArticleShaAndId(article: Partial<ArticleEntity>): Promise<{ sha: string, id: string }> {
    if (ValidationUtils.isEmptyString(article.sourceId)) {
      throw new Error("article.sourceId cannot be null or undefined");
    }
    const secondaryInput = article.externalId ? article.externalId : article.title;
    if (ValidationUtils.isEmptyString(secondaryInput)) {
      throw new Error("article.externalId or article.title must be set");
    }
    const sha = await HashUtils.digest(HashAlgo.SHA256, article.sourceId + "" + secondaryInput);
    const id = `A-${await HashUtils.digest(HashAlgo.SHA1, sha)}`;
    return { sha, id };
  }

}


const useInMemoryContentStore = defineStore({
  id: "inMemoryContentStore",
  state: () => ({
    sources: [],
    articles: [],
  }),
  getters: {
    /// ============================================================================================
    ///
    /// Accessors for SourceEntity
    ///
    getAllSources: (state) => state.sources,
    getSourceById: (state) => (id: string) => state.sources.find((source: SourceEntity) => source.id === id),
    getSourcesCount: (state) => state.sources.length,
    findSourceWithFeedUrl: (state) => (feedUrl: string) => state.sources.find((source: SourceEntity) => source.feedUrl === feedUrl),

    /// ============================================================================================
    ///
    /// Accessors for ArticleEntity
    ///
    getAllArticles: (state) => state.articles,
    getAllArticlesCount: (state) => state.articles.length,
    getArticleById: (state) => (id: string) => state.articles.find((article: ArticleEntity) => article.id === id),
    getArticlesForSourceId: (state) => (sourceId: string) => state.articles.filter((article: ArticleEntity) => article.sourceId === sourceId),
    getArticlesCountForSourceId: (state) => (sourceId: string) => state.articles.filter((article: ArticleEntity) => article.sourceId === sourceId).length,
  },
  actions: {
    /// ===========================================================================================
    /// 
    ///   Mutators for SourceEntity
    ///
    async addSource(source: Partial<SourceEntity>) {
      if (ValidationUtils.isEmptyString(source.title)) {
        throw new Error("source.title cannot be null or undefined");
      }
      if (ValidationUtils.isEmptyString(source.feedUrl)) {
        throw new Error("source.feedUrl cannot be null or undefined");
      }
      if (this.findSourceWithFeedUrl(source.feedUrl!)) {
        throw new Error("source.feedUrl must be unique");
      }

      source.id = await ContentStoreUtils.generateSourceId(source);

      // @ts-ignore: This expression is not callable. Type 'never[]' has no call signatures. ts(2349)
      this.sources.push(source);
      return source as SourceEntity
    },
    updateSource(source: Partial<SourceEntity>) {
      if (ValidationUtils.isEmptyString(source.id)) {
        throw new Error("source.id cannot be null or undefined");
      }
      const existingSource = this.getSourceById(source.id!);
      if (!existingSource) {
        throw new Error(`Source with id ${source.id} not found`);
      }
      Object.assign(existingSource, source);
      return existingSource;
    },
    deleteSource(id: string) {
      const existingSource = this.getSourceById(id)
      if (!existingSource) {
        throw new Error(`Source with id ${id} not found`)
      }
      this.sources = this.sources.filter((source: SourceEntity) => source.id !== id);
    },
    deleteAllSources() {
      this.sources = [];
    },

    /// ===========================================================================================
    ///
    ///   Mutators for ArticleEntity
    ///
    async addArticle(article: Partial<ArticleEntity>) {
      if (ValidationUtils.isEmptyString(article.sourceId)) {
        throw new Error("article.sourceId cannot be null or undefined");
      }
      const secondaryInput = article.externalId ? article.externalId : article.title;
      if (ValidationUtils.isEmptyString(secondaryInput)) {
        throw new Error("article.externalId or article.title must be set");
      }

      const { sha, id } = await ContentStoreUtils.generateArticleShaAndId(article);

      if (this.getArticleById(id)) {
        throw new Error("Collision on calculated article id (SHA1)");
      }

      article.id = id;
      article.sha = sha;
      article.freshness = Freshness.New;
      article.isTombstoned = false;

      // @ts-ignore: This expression is not callable. Type 'never[]' has no call signatures. ts(2349)
      this.articles.push(article);
      return article as ArticleEntity;
    },
    updateArticle(article: Partial<ArticleEntity>) {
      // TODO: updateArticle may need some more restrictions around what can be updated
      if (ValidationUtils.isEmptyString(article.id)) {
        throw new Error("article.id cannot be null or undefined");
      }
      const existingArticle = this.getArticleById(article.id!);
      if (!existingArticle) {
        throw new Error(`Article with id ${article.id} not found`);
      }
      Object.assign(existingArticle, article);
      return existingArticle;
    },
    deleteArticle(id: string) {
      const existingArticle = this.getArticleById(id)
      if (!existingArticle) {
        throw new Error(`Article with id ${id} not found`)
      }
      this.articles = this.articles.filter((article: ArticleEntity) => article.id !== id);
    },
    deleteAllArticles() {
      this.articles = [];
    },

    /// ===========================================================================================
    ///
    ///   Global Mutators
    ///
    clearStore() {
      this.deleteAllSources()
      this.articles = [];
    }
  },
});


export default class InMemoryContentStore implements ContentStoreInterface {

  private static INSTANCE: InMemoryContentStore;
  private readonly piniaContentStore;

  private constructor() {
    this.piniaContentStore = useInMemoryContentStore;
  }

  public static getInstance(): InMemoryContentStore {
    if (!InMemoryContentStore.INSTANCE) {
      InMemoryContentStore.INSTANCE = new InMemoryContentStore();
    }
    return InMemoryContentStore.INSTANCE;
  }

  // 
  // Store API
  //

  getReactiveContentStore(): any {
    return this.piniaContentStore();
  }
  getStoreId(): string {
    return this.piniaContentStore().$id;
  }
  clearStore(): void {
    this.getReactiveContentStore().clearStore();
  }

  //
  // Sources API
  //

  addSource(source: Partial<SourceEntity>): Promise<SourceEntity> {
    return Promise.resolve(this.getReactiveContentStore().addSource(source));
  }
  getSourceById(id: string): Promise<Maybe<SourceEntity>> {
    return Promise.resolve(this.getReactiveContentStore().getSourceById(id));
  }
  updateSource(source: Partial<SourceEntity>): Promise<SourceEntity> {
    return Promise.resolve(this.getReactiveContentStore().updateSource(source));
  }
  deleteSource(id: string): Promise<void> {
    return Promise.resolve(this.getReactiveContentStore().deleteSource(id));
  }
  getAllSources(): SourceEntity[] {
    // @ts-ignore: This expression is not callable. Type 'never[]' has no call signatures. ts(2349)
    return this.getReactiveContentStore().getAllSources
  }
  getSourcesCount(): number {
    return this.getReactiveContentStore().getSourcesCount;
  }
  deleteAllSources(): Promise<number> {
    const count = this.getReactiveContentStore().getSourcesCount;
    this.getReactiveContentStore().deleteAllSources();
    return Promise.resolve(count);
  }

  //
  // Articles API
  //

  addArticle(article: Partial<ArticleEntity>): Promise<ArticleEntity> {
    return Promise.resolve(this.getReactiveContentStore().addArticle(article));
  }
  getArticleById(id: Maybe<string>): Maybe<ArticleEntity> {
    if (!id) {
      return undefined;
    }
    return this.getReactiveContentStore().getArticleById(id);
  }
  updateArticle(article: Partial<ArticleEntity>): Promise<ArticleEntity> {
    return Promise.resolve(this.getReactiveContentStore().updateArticle(article));
  }
  deleteArticle(id: string): Promise<void> {
    return Promise.resolve(this.getReactiveContentStore().deleteArticle(id));
  }
  getAllArticles(): ArticleEntity[] {
    return this.getReactiveContentStore().getAllArticles;
  }
  getAllArticlesCount(): number {
    return this.getReactiveContentStore().getAllArticlesCount;
  }
  deleteAllArticles(): Promise<number> {
    const count = this.getReactiveContentStore().getAllArticlesCount;
    this.getReactiveContentStore().deleteAllArticles();
    return Promise.resolve(count);
  }
  getArticlesForSourceId(sourceId: string): ArticleEntity[] {
    return this.getReactiveContentStore().getArticlesForSourceId(sourceId);
  }
  getArticlesCountForSourceId(sourceId: string): Promise<number> {
    return Promise.resolve(this.getReactiveContentStore().getArticlesCountForSourceId(sourceId));
  }

}
