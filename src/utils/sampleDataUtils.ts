import type { Article } from "@/models/article";
import type { Source } from "@/models/source";
import DateUtils from "./dateUtils";
import StringUtils from "./stringUtils";
import NumberUtils from "./numberUtils";



export class SampleDataUtils {
    static randomFreshness() {
        const random = Math.floor(Math.random() * 10);
        if (random < 1) {
            // 10% chance of being new
            return "New";
        } else if (random < 8) {
            // 70% chance of being current
            return "Current";
        } else {
            // 20% chance of being stale
            return "Stale";
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
        const randomString = StringUtils.randomStringOfLength(6);
        return {
            title: `Source ${randomString}`,
            url: `https://www.example.com/${randomString}`,
            description: StringUtils.wordsOfloremIpsum(NumberUtils.randomIntInRange(5, 20)),
        };
    }

    static generateArticle(): Article {
        const randomArticleSlug = StringUtils.randomStringOfLength(6);
        const randomAuthor = `${StringUtils.randomStringOfLength(6)} ${StringUtils.randomStringOfLength(6)}`;
        const randomNumberOfContentWords = NumberUtils.randomIntInRange(20, 100);
        const randomNumberOfTitleWords = NumberUtils.randomIntInRange(3, 15);
        return {
            title: StringUtils.randomWordsOfloremIpsum(randomNumberOfTitleWords),
            author: randomAuthor,
            link: `https://www.example.com/article/${randomArticleSlug}`,
            content: StringUtils.wordsOfloremIpsum(randomNumberOfContentWords),
            publishedDate: DateUtils.randomDate(
                new Date(2021, 0, 1),
                new Date()
            ),
        };
    }
}
