import type { Source } from "@/models/source";
import type { Article } from "@/models/article";
import { defineStore } from "pinia";

import DateUtils from "@/utils/dateUtils";

const _utils = {
    sortByDateDesc(a: Article, b: Article) {
        return b.publishedDate.getTime() - a.publishedDate.getTime();
    }
}

export const useContentStore = defineStore({
    id: "content",

    state: () => ({
        sources: [] as Source[],
        articles: [] as Article[],
    }),

    getters: {
        getSources: (state) => state.sources,
        getArticles: (state) => state.articles,
        getFilteredArticles: (state) => (sourceId: string) => {
            return state.articles.filter(a => a.sourceId === sourceId);
        }
    },

    actions: {
        addSource(source: Source) {
            this.sources.push(source);
        },
        addArticle(article: Article) {
            this.articles.push(article);
        },
        initSampleData(maxSources = 10, maxArticlesPerSource = 10) {
            this.sources = [];
            this.articles = [];
            const MAX = 10
            for (let i = 0; i < maxSources; i++) {
                // Create new source
                const num_articles = Math.floor(Math.random() * maxArticlesPerSource); // Between 0 and 9 articles

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
                        content: `Content for article ${j}`,
                        publishedDate: DateUtils.randomDate(new Date(2021, 0, 1), new Date())
                    };
                    this.addArticle(article);
                }
            }
            console.log("Sample data loaded");
        }
    },

    
});
