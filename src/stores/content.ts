import type { Source } from "@/models/source";
import type { Article } from "@/models/article";
import { defineStore } from "pinia";

import DateUtils from "@/utils/dateUtils";
import { Freshness } from "@/models/freshness";

export const useContentStore = defineStore({
    id: "content",

    state: () => ({
        sources: [] as Source[],
        articles: [] as Article[],
    }),

    getters: {
        getAllSources: (state) => state.sources,
        getAllArticles: (state) => state.articles,
        getArticles: (state) => { 
            return state.articles
                .filter(a => !a.isTombstoned);
        },
        getArticlesForSourceId: (state) => (sourceId: string) => {
            return state.articles
                .filter(a => !a.isTombstoned)
                .filter(a => a.sourceId === sourceId);
        },
        getArticle: (state) => (articleSha: string | null) => {
            if (articleSha === null) return null;
            return state.articles.find(a => a.sha256 === articleSha);
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
            
            const _randomFreshness = () => {
                const random = Math.floor(Math.random() * 10)
                if(random < 1){
                    // 10% chance of being new
                    return Freshness.New
                } else if(random < 8){
                    // 70% chance of being current
                    return Freshness.Current
                } else {
                    // 20% chance of being stale
                    return Freshness.Stale
                }
            }

            const _randomTombstone = () => {
                const random = Math.floor(Math.random() * 10)
                if(random < 4){
                    // 40% chance of being tombstoned
                    return true
                } else {
                    // 60% chance of not being tombstoned
                    return false
                }
            }

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
                        publishedDate: DateUtils.randomDate(new Date(2021, 0, 1), new Date()),
                        freshness: _randomFreshness(),
                        isTombstoned: _randomTombstone()
                    };
                    this.addArticle(article);
                }
            }
            console.log("Sample data loaded");
        }
    },

    
});
