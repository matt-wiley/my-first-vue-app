import type Article from "@/models/article";
import Freshness from "@/models/freshness";
import type Source from "@/models/source";
import { DateUtils as du } from "./dateUtils";
import { NumberUtils as nu } from "./numberUtils";
import { StringUtils as su } from "./stringUtils";
import type ContentStoreInterface from "@/stores/contentStoreInterface";
import type ArticleEntity from "@/models/articleEntity";



export default class SampleDataUtils {
    static randomFreshness() {
        const random = Math.floor(Math.random() * 10);
        if (random < 1) {
            // 10% chance of being new
            return Freshness.New;
        } else if (random < 8) {
            // 70% chance of being current
            return Freshness.Current;
        } else {
            // 20% chance of being stale
            return Freshness.Stale;
        }
    }

    static randomTombstone() {
        const random = Math.floor(Math.random() * 10);
        if (random < 4) {
            // 40% chance of being tombstoned
            return true;
        } else {
            // 60% chance of not being tombstoned
            return false;
        }
    }

    static generateSource(): Source {
        const randomString = su.randomStringOfLength(6);
        return {
            title: `Source ${randomString}`,
            feedUrl: `https://www.example.com/${randomString}`,
            description: su.wordsOfloremIpsum(nu.randomIntInRange(5, 20)),
        };
    }

    static generateArticle(): Article {
        const randomArticleSlug = su.randomStringOfLength(6);
        const randomAuthor = `${su.randomStringOfLength(6)} ${su.randomStringOfLength(6)}`;
        const randomNumberOfContentWords = nu.randomIntInRange(20, 100);
        const randomNumberOfTitleWords = nu.randomIntInRange(3, 15);
        return {
            title: su.capitalizeFirstLetter(su.randomWordsOfloremIpsum(randomNumberOfTitleWords)),
            author: randomAuthor,
            link: `https://www.example.com/article/${randomArticleSlug}`,
            content: su.wordsOfloremIpsum(randomNumberOfContentWords),
            date: du.randomDate(
                new Date(2021, 0, 1),
                new Date()
            ),
        };
    }

    /**
     * @deprecated Use loadRandomContent instead
     * 
     * @param contentStore 
     * @param maxSources 
     * @param maxArticlesPerSource
     */
    static async initSampleData(contentStore: any, maxSources = 10, maxArticlesPerSource = 10) {
      contentStore.sources = [];
      contentStore.articles = [];

      // Generate new sample data
      for (let i = 0; i < maxSources; i++) {
        // create new Source
        const source = SampleDataUtils.generateSource();
        // add SourceRecord to datastore, and get id
        const sourceRecord = await contentStore.addSource(source);

        const randomNumberOfArticles = nu.randomIntInRange(1, maxArticlesPerSource);
        for (let j = 0; j < randomNumberOfArticles; j++) {
          // create new Article
          const article = SampleDataUtils.generateArticle();
          // add ArticleRecord to datastore
          await contentStore.addArticle(sourceRecord, article);
        }
      }
      console.log("Sample data loaded");
    }

    /**
     * Load random content into an implementation of ContentStoreInterface.
     * 
     * @param contentStore An implementation of ContentStoreInterface
     * @param maxSources 
     * @param maxArticlesPerSource  
     */
    static async loadRandomContent(contentStore: ContentStoreInterface, maxSources = 10, maxArticlesPerSource = 10) {
      contentStore.clearStore();

      // Generate new sample data
      for (let i = 0; i < maxSources; i++) {
        // create new Source
        const source = SampleDataUtils.generateSource();
        // add SourceRecord to datastore, and get id
        const sourceRecord = await contentStore.addSource(source);

        const randomNumberOfArticles = nu.randomIntInRange(1, maxArticlesPerSource);
        for (let j = 0; j < randomNumberOfArticles; j++) {
          // create new Article
          const article = SampleDataUtils.generateArticle() as Partial<ArticleEntity>;
          // add ArticleRecord to datastore
          article.sourceId = sourceRecord.id;
          await contentStore.addArticle(article);
        }
      }
      console.log("Random data loaded");
    }
}
