import type { Article } from "@/interfaces/article";
import type { DataServiceInterface } from "@/interfaces/data-service";
import type { Source } from "@/interfaces/source";
import { ArticlesService } from "./articles-service";
import { SourcesService } from "./sources-service";

export default class DataService  implements DataServiceInterface {
  private static instance: DataService;

  private articlesService: ArticlesService;
  private sourcesService: SourcesService;

  private constructor() {
    this.articlesService = new ArticlesService();
    this.sourcesService = new SourcesService();
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Article methods

  addArticle(article: Article): void {
    this.articlesService.addArticle(article);
  }

  getArticles(): Array<Article> {
    return this.articlesService.getArticles();
  }

  getArticlesBySourceId(sourceId: string): Array<Article> {
    return this.articlesService.getArticlesBySourceId(sourceId);
  }

  // Source methods

  addSource(source: Source): void {
    this.sourcesService.addSource(source);
  }

  getSources(): Array<Source> {
    return this.sourcesService.getSources();
  }

}
