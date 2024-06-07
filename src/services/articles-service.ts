
export interface Article {
    sha256: string;
    sourceId: string;
    author: string;
    link: string;
    title: string;
    content: string;
}

export class ArticlesService {

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