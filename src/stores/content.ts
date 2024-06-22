import { defineStore } from "pinia";

import type Source from "@/models/source";
import type ArticleRecord from "@/models/articleRecord";
import type Article from "@/models/article";
import type { SourceRecord } from "@/models/sourceRecord";
import HashUtils, { HashAlgo } from "@/utils/hashUtils";
import { SampleDataUtils } from "@/utils/sampleDataUtils";
import { NumberUtils as nu } from "@/utils/numberUtils";

export const useContentStore = defineStore({
    id: "content",

    state: () => ({
        sources: [] as SourceRecord[],
        articles: [] as ArticleRecord[],
    }),

    getters: {
        getAllSources: (state) => state.sources,
        getAllArticles: (state) => state.articles,
        getArticles: (state) => {
            return state.articles.filter((a) => !a.isTombstoned);
        },
        getArticlesForSourceId: (state) => (sourceId: string) => {
            return state.articles
                .filter((a) => !a.isTombstoned)
                .filter((a) => a.sourceId === sourceId);
        },
        getArticle: (state) => (articleSha: string | null) => {
            if (articleSha === null) return null;
            return state.articles.find((a) => a.id === articleSha);
        },
    },

    actions: {
        async addSource(source: Source): Promise<SourceRecord> {
            const sourceRecord = {... source} as SourceRecord;
            const hash = await HashUtils.digest(
                HashAlgo.SHA1,
                sourceRecord.feedUrl
            );
            sourceRecord.id = `S-${hash}`;
            this.sources.push(sourceRecord);
            return sourceRecord;
        },
        async addArticle(sourceRecord: SourceRecord, article: Article): Promise<ArticleRecord> {
            const articleRecord = {... article} as ArticleRecord;
            articleRecord.sourceId = sourceRecord.id;
            
            const sha = await HashUtils.digest(
                HashAlgo.SHA256,
                `${articleRecord.sourceId}${articleRecord.title}${articleRecord.link}`
            );
            const id = await HashUtils.digest(
                HashAlgo.SHA1,
                sha
            );
            articleRecord.sha = sha;
            articleRecord.id = `A-${id}`;
            this.articles.push(articleRecord);
            return articleRecord;
        },
        async deleteArticle(articleRecord: ArticleRecord) {
            if (articleRecord.freshness !== "Stale") {
              articleRecord.isTombstoned = true;
            }
            else {
              const index = this.articles.indexOf(articleRecord);
              if (index > -1) {
                this.articles.splice(index, 1);
              }
            }
        },
        async initSampleData(maxSources = 10, maxArticlesPerSource = 10) {
            // Clear existing data
            this.sources = [];
            this.articles = [];

            // Generate new sample data
            for (let i = 0; i < maxSources; i++) {
                // create new Source
                const source = SampleDataUtils.generateSource();
                // add SourceRecord to datastore, and get id
                const sourceRecord = await this.addSource(source);

                const randomNumberOfArticles = nu.randomIntInRange(1, maxArticlesPerSource);
                for (let j = 0; j < randomNumberOfArticles; j++) {
                    // create new Article
                    const article = SampleDataUtils.generateArticle();
                    // add ArticleRecord to datastore
                    await this.addArticle(sourceRecord, article);
                }
            }
            console.log("Sample data loaded");
        },
    },
});
