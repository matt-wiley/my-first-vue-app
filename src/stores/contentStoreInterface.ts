import type ArticleEntity from "@/models/articleEntity";
import type SourceEntity from "@/models/sourceEntity";
import type { Maybe } from "@/types/maybe";

export default interface ContentStoreInterface {

  // Store API
  getReactiveContentStore(): any;
  getStoreId(): string;
  clearStore(): void;

  // Sources API
  addSource(source: Partial<SourceEntity>): Promise<SourceEntity>;
  getSourceById(id: string): Promise<Maybe<SourceEntity>>;
  updateSource(source: Partial<SourceEntity>): Promise<SourceEntity>;
  deleteSource(id: string): Promise<void>; 
  getAllSources(): SourceEntity[];
  getSourcesCount(): Promise<number>; // returns the number of sources in the store
  deleteAllSources(): Promise<number>; // returns the number of sources deleted

  // Articles API
  addArticle(article: Partial<ArticleEntity>): Promise<ArticleEntity>;
  getArticleById(id: string): Promise<Maybe<ArticleEntity>>;
  updateArticle(article: Partial<ArticleEntity>): Promise<ArticleEntity>;
  deleteArticle(id: string): Promise<void>;
  getAllArticles(): ArticleEntity[];
  getAllArticlesCount(): Promise<number>; // returns the number of articles in the store
  deleteAllArticles(): Promise<number>; // returns the number of articles deleted
  getArticlesForSourceId(sourceId: string): Promise<ArticleEntity[]>;
  getArticlesCountForSourceId(sourceId: string): Promise<number>; // returns the number of articles for the source for the given sourceId
  
  // Refresh API
  refreshSource(sourceId: string): Promise<number>; // returns the number of articles added
  refreshAllSources(): Promise<number>; // returns the number of articles added

}