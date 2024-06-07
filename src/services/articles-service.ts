import type { Article } from "@/interfaces/article";
import type { ArticlesServiceInterface } from "@/interfaces/articles-service";

export class ArticlesService implements ArticlesServiceInterface {

    private articles: Array<Article>;

    constructor() {
        this.articles = [];
    }

    addArticle(article: Article) {
        this.articles.push(article);
    }

    getArticles() {
        return this.articles;
    }

    getArticlesBySourceId(sourceId: string) {
        return this.articles.filter(article => article.sourceId === sourceId);
    }
}