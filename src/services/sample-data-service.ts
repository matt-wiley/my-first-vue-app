import type { Article } from "@/interfaces/article";
import type { DataServiceInterface } from "@/interfaces/data-service";
import type { Source } from "@/interfaces/source";
import DataService from "./data-service";



export class SampleDataService implements DataServiceInterface {

    // Sample data singleton
    private static instance: SampleDataService;
    private static MAX_DIMENSION = 10;

    // Concrete implementation of the DataServiceInterface
    private dataService: DataServiceInterface;

    private constructor() {
        this.dataService = DataService.getInstance();
    }

    static getInstance(): SampleDataService {
        if (!SampleDataService.instance) {
            SampleDataService.instance = new SampleDataService();
            SampleDataService.instance.loadSampleData();
        }
        return SampleDataService.instance;
    }

    private loadSampleData(): void {
        const max = SampleDataService.MAX_DIMENSION;
        for (let i = 0; i < max; i++) {
            // Create new source
            const num_articles = Math.floor(Math.random() * max) + 1; // Between 1 and 10 articles

            const source: Source = {
                id: `source_${i}`,
                title: `Source ${i}`,
                url: `https://www.example.com/source_${i}`,
                description: `Description for source ${i}`
            };
            this.addSource(source);

            for (let j = 0; j < num_articles; j++) {
                // Create new article
                const article: Article = {
                    sha256: `sha256_article_${i}_${j}`,
                    sourceId: source.id,
                    title: `Article ${j}`,
                    author: `Author ${j}`,
                    link: `https://www.example.com/article_${i}_${j}`,
                    content: `Contnet for article ${j}`,
                    publishedDate: this.randomDate(new Date(2021, 0, 1), new Date())
                };
                this.addArticle(article);
            }
        }
        console.log("Sample data loaded");
    }

    // Article methods

    addArticle(article: Article): void {
        this.dataService.addArticle(article);
    }

    getArticles(): Array<Article> {
        return this.dataService.getArticles();
    }

    getArticlesBySourceId(sourceId: string): Array<Article> {
        return this.getArticlesBySourceId(sourceId);
    }

    // Source methods

    addSource(source: Source): void {
        this.dataService.addSource(source);
    }

    getSources(): Array<Source> {
        return this.dataService.getSources();
    }


    // Private methods

    private randomDate(start: Date, end: Date, startHour = 0, endHour = 24) {
        const dateDifference = end.getTime() - start.getTime();
        var date = new Date(start.getTime() + Math.random() * dateDifference);
        var hour = startHour + Math.random() * (endHour - startHour) | 0;
        date.setHours(hour);
        return date;
    }
}