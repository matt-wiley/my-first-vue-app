import type { Article } from "./article";


export interface ArticlesServiceInterface {
    addArticle(article: Article): void;
    getArticles(): Array<Article>;
    getArticlesBySourceId(sourceId: string): Array<Article>;
}