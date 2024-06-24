import { readFileSync } from "fs";
import { describe, it, expect, vi } from "vitest";

import FeedParserService from "../feedParserService";
import TestUtils from "@/utils/testUtils";


describe("feedParserService", () => {

    it("parses Atom Feed (Reddit)", async () => {
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


    it("parses RSS Feed (ScienceDaily.com)", async () => {

        const feedUrl = "https://www.sciencedaily.com/rss/top/science.xml";
        const feedDataFilePath = "src/services/__test__/data/feeds/www.sciencedaily.com/202406211112.xml";

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
