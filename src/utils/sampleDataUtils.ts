import type { Article } from "@/models/article";
import type { Source } from "@/models/source";
import { DateUtils as du } from "./dateUtils";
import { StringUtils as su } from "./stringUtils";
import { NumberUtils as nu } from "./numberUtils";
import { Freshness } from "@/models/freshness";



export class SampleDataUtils {
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
            publishedDate: du.randomDate(
                new Date(2021, 0, 1),
                new Date()
            ),
        };
    }
}
