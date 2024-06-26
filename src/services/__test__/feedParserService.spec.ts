import { describe, it, expect } from "vitest";

import FeedParserService from "../feedParserService";
import TestUtils from "@/utils/testUtils";
import exp from "constants";

// Suppress console output
// console.log = () => {};
// console.error = () => {};

describe("feedParserService", () => {

    it("will parse an Atom XML Document (Reddit)", async () => {
        const feedDataFilePath = "src/services/__test__/data/feeds/www.reddit.com/202406211112.xml";
        const feedDoc = TestUtils.parseXmlToDocument(feedDataFilePath);

        const feedParserService = FeedParserService.getInstance();
        const parseFeed = feedParserService.parseFeed(feedDoc);

        expect(parseFeed.source.title).toBe("reddit: the front page of the internet");
        expect(parseFeed.source.url).toBe("https://www.reddit.com/.rss");
        expect(parseFeed.source.feedUrl).not.toBeDefined(); 
        expect(parseFeed.source.description).not.toBeDefined();
        expect(parseFeed.articles.length).toBe(25);

        for (const article of parseFeed.articles) {
            expect(article.title).toBeDefined();
            expect(article.date).toBeDefined();
            expect(article.author).toBeDefined();
            expect(article.link).toBeDefined();
            expect(article.content).toBeDefined();
        }
    });

    it("will parse an RSS XML Document (ScienceDaily.com)", async () => {
        const feedDataFilePath = "src/services/__test__/data/feeds/www.sciencedaily.com/202406211854.xml";
        const feedDoc = TestUtils.parseXmlToDocument(feedDataFilePath);

        const feedParserService = FeedParserService.getInstance();
        const parseFeed = feedParserService.parseFeed(feedDoc);

        expect(parseFeed.source.title).toBe("All Top News -- ScienceDaily");
        expect(parseFeed.source.url).toBe("https://www.sciencedaily.com/news/top/");
        expect(parseFeed.source.feedUrl).not.toBeDefined(); 
        expect(parseFeed.source.description).toBe("Top science stories featured on ScienceDaily's home page.");
        expect(parseFeed.articles.length).toBe(60);

        for (const article of parseFeed.articles) {
            expect(article.title).toBeDefined();
            expect(article.date).toBeDefined();
            expect(article.author).toBeDefined();
            expect(article.link).toBeDefined();
            expect(article.content).toBeDefined();
        }
    });


    it("will fetch and parse an Atom Feed (Reddit)", async () => {
        const feedUrl = "https://www.reddit.com/.rss";
        const feedDataFilePath = "src/services/__test__/data/feeds/www.reddit.com/202406211112.xml"; 

        TestUtils.mockFetchFeed(feedUrl, feedDataFilePath);

        const feedParserService = FeedParserService.getInstance();
        const parseFeed = await feedParserService.fetchAndParseFeed(feedUrl);

        expect(parseFeed.source.feedUrl).toBe(feedUrl);
        expect(parseFeed.source.title).toBe("reddit: the front page of the internet");
        expect(parseFeed.source.url).toBe(feedUrl);
        expect(parseFeed.source.description).toBe(undefined);
        expect(parseFeed.articles.length).toBe(25);

        for (const article of parseFeed.articles) {
            expect(article.title).toBeDefined();
            expect(article.date).toBeDefined();
            expect(article.author).toBeDefined();
            expect(article.link).toBeDefined();
            expect(article.content).toBeDefined();
        }

    });

    it("will fetch and parse an RSS Feed (ScienceDaily.com)", async () => {

        const feedUrl = "https://www.sciencedaily.com/rss/top/science.xml";
        const feedDataFilePath = "src/services/__test__/data/feeds/www.sciencedaily.com/202406211854.xml";

        TestUtils.mockFetchFeed(feedUrl, feedDataFilePath);

        const feedParserService = FeedParserService.getInstance();
        const parseFeed = await feedParserService.fetchAndParseFeed(feedUrl);

        expect(parseFeed.source.feedUrl).toBe(feedUrl);
        expect(parseFeed.source.title).toBe("All Top News -- ScienceDaily");
        expect(parseFeed.source.url).toBe("https://www.sciencedaily.com/news/top/");
        expect(parseFeed.source.description).toBe("Top science stories featured on ScienceDaily's home page.");
        expect(parseFeed.articles.length).toBe(60);

        for (const article of parseFeed.articles) {
            expect(article.title).toBeDefined();
            expect(article.date).toBeDefined();
            expect(article.author).toBeDefined();
            expect(article.link).toBeDefined();
            expect(article.content).toBeDefined();
        }

    });

});
