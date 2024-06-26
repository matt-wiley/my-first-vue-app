import type ArticleEntity from "@/models/articleEntity";
import type SourceEntity from "@/models/sourceEntity";
import type ContentStoreInterface from "@/stores/contentStoreInterface";
import type { Maybe } from "@/types/maybe";
import HashUtils, { HashAlgo } from "@/utils/hashUtils";
import ValidationUtils from "@/utils/validationUtils";
import { get } from "http";
import { defineStore } from "pinia";



class ContentStoreUtils {

  static async generateSourceId(source: Partial<SourceEntity>): Promise<string> {
    if (ValidationUtils.isEmptyString(source.feedUrl)) {
      throw new Error("source.feedUrl cannot be null or undefined");
    }
    return `S-${await HashUtils.digest(HashAlgo.SHA1, source.feedUrl! )}`
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
    getAllSources: (state) => state.sources,
    getSourceById: (state) => (id: string) => state.sources.find((source: SourceEntity) => source.id === id),
    getSourcesCount: (state) => state.sources.length,
    findSourceWithFeedUrl: (state) => (feedUrl: string) => state.sources.find((source: SourceEntity) => source.feedUrl === feedUrl),
    getAllArticles: (state) => state.articles,
    getArticleById: (state) => (id: string) => state.articles.find((article: ArticleEntity) => article.id === id),
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
      if(!existingSource) {
        throw new Error(`Source with id ${source.id} not found`);
      }
      Object.assign(existingSource, source);
      return existingSource;
    },
    deleteSource(id: string) {
      const existingSource = this.getSourceById(id)
      if(!existingSource) {
        throw new Error(`Source with id ${id} not found`)
      }
      this.sources = this.sources.filter((source: SourceEntity) => source.id !== id);
    },
    deleteAllSources() {
      this.sources = [];
      return this.sources.length;
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

      article.id = id;
      article.sha = sha;

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
      if(!existingArticle) {
        throw new Error(`Article with id ${article.id} not found`);
      }
      Object.assign(existingArticle, article);
      return existingArticle;
    },


    /// ===========================================================================================
    ///
    ///   Global Mutators
    ///
    clearStore() {
      this.deleteAllSources()
      this.articles = [];
    }
  },});


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
  getSourcesCount(): Promise<number> {
    return Promise.resolve(this.getReactiveContentStore().getSourcesCount);
  }
  deleteAllSources(): Promise<number> {
    return Promise.resolve(this.getReactiveContentStore().deleteAllSources());
  }

  //
  // Articles API
  //

  addArticle(article: Partial<ArticleEntity>): Promise<ArticleEntity> {
    return Promise.resolve(this.getReactiveContentStore().addArticle(article));
  }
  getArticleById(id: string): Promise<Maybe<ArticleEntity>> {
    return Promise.resolve(this.getReactiveContentStore().getArticleById(id));
  }
  updateArticle(article: Partial<ArticleEntity>): Promise<ArticleEntity> {
    return Promise.resolve(this.getReactiveContentStore().updateArticle(article));
  }
  deleteArticle(id: string): Promise<void> {
    // TODO: // YAH // Implement deleteArticle 
    throw new Error("Method not implemented.");
  }
  getAllArticles(): ArticleEntity[] {
    return this.getReactiveContentStore().getAllArticles;
  }
  getAllArticlesCount(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  deleteAllArticles(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getArticlesForSourceId(sourceId: string): Promise<ArticleEntity[]> {
    throw new Error("Method not implemented.");
  }
  getArticlesCountForSourceId(sourceId: string): Promise<number> {
    throw new Error("Method not implemented.");
  }

  //
  // Refresh API
  //

  refreshSource(sourceId: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  refreshAllSources(): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
