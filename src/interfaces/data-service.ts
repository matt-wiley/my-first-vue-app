import type { Article } from "./article";
import type { Source } from "./source";


export interface DataServiceInterface {
    addArticle(article: Article): void;
    getArticles(): Array<Article>;
    getArticlesBySourceId(sourceId: string): Array<Article>;
    addSource(source: Source): void;
    getSources(): Array<Source>;
}