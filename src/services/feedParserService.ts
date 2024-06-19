import type Source from "../models/source";
import type Article from "../models/article";

import FeedFetchService from "./feedFetchService";
import AtomParserService from "./atomParserService";

export interface ParsedFeed {
    source: Source;
    articles: Article[];
}

export default class FeedParserService {
    private static instance: FeedParserService;

    private constructor() {}

    public static getInstance(): FeedParserService {
        if (!FeedParserService.instance) {
            FeedParserService.instance = new FeedParserService();
        }
        return FeedParserService.instance;
    }

    public async fetchAndParseFeed(feedUrl: string): Promise<ParsedFeed> {
        const feed = await FeedFetchService.getInstance().updateFeed(feedUrl);
        const result = this.parseFeed(feed);
        result.source.feedUrl = feedUrl;
        return result;
    }

    public parseFeed(feed: Document): ParsedFeed {
        const feedType = feed.documentElement.tagName;
        switch (feedType) {
            case "rss":
                return this.parseFeedWithContext(feed, new RssParsingContext());
            case "feed":
                return AtomParserService.parseFeedAndTransform(feed);
            default:
                throw new Error("Unsupported feed type");
        }
    }

    private parseFeedWithContext(feed: Document, context: ParsingContext): ParsedFeed {
        const source = this.parseSource(feed, context);
        const articles = this.parseArticles(feed, context);
        return { source, articles };
    }

    private parseSource(feed: Document, context: ParsingContext): Source {
        const title = this.getTagContent(feed.documentElement, context.sourceTitleTag());
        const siteUrl = this.getTagContent(feed.documentElement, context.sourceSiteUrlTag());
        const description = this.getTagContent(feed.documentElement, context.sourceDescriptionTag());
        return { title, url: siteUrl, description, feedUrl: "To be set last" };
    }

    private parseArticles(feed: Document, context: ParsingContext): Article[] {
        const articleElements = feed.getElementsByTagName(context.articleTag());
        const articles: Article[] = [];
        for (let i = 0; i < articleElements.length; i++) {
            const article = this.parseArticle(articleElements[i], context);
            articles.push(article);
        }
        return articles;
    }

    private parseArticle(articleElement: Element, context: ParsingContext): Article {
        const author = this.getTagContent(articleElement, context.articleAuthorTag());
        const link = this.getTagContent(articleElement, context.articleLinkTag());
        const title = this.getTagContent(articleElement, context.articleTitleTag());
        const content = this.getTagContent(articleElement, context.articleContentTag());
        const date = new Date(this.getTagContent(articleElement, context.articlePublishedDateTag()));
        return { author, link, title, content, date};
    }



    private getTagContent(element: Element, tagName: string): string {
        const tag = element.getElementsByTagName(tagName)[0];
        return tag?.innerHTML || "";
    }
}

interface ParsingContext {
    sourceTitleTag: () => string;
    sourceSiteUrlTag: () => string;
    sourceDescriptionTag: () => string;
    articleTag: () => string;
    articleAuthorTag: () => string;
    articleLinkTag: () => string;
    articleTitleTag: () => string;
    articleContentTag: () => string;
    articlePublishedDateTag: () => string;
}

class RssParsingContext implements ParsingContext {
    private static readonly SOURCE_TITLE_TAG = "title";
    private static readonly SOURCE_SITE_URL_TAG = "link";
    private static readonly SOURCE_DESCRIPTION_TAG = "description";
    private static readonly ARTICLE_TAG = "item";
    private static readonly ARTICLE_AUTHOR_TAG = "author";
    private static readonly ARTICLE_LINK_TAG = "link";
    private static readonly ARTICLE_TITLE_TAG = "title";
    private static readonly ARTICLE_CONTENT_TAG = "description";
    private static readonly ARTICLE_PUBLISHED_DATE_TAG = "pubDate";

    public sourceTitleTag(): string {
        return RssParsingContext.SOURCE_TITLE_TAG;
    }

    public sourceSiteUrlTag(): string {
        return RssParsingContext.SOURCE_SITE_URL_TAG;
    }

    public sourceDescriptionTag(): string {
        return RssParsingContext.SOURCE_DESCRIPTION_TAG;
    }

    public articleTag(): string {
        return RssParsingContext.ARTICLE_TAG;
    }

    public articleAuthorTag(): string {
        return RssParsingContext.ARTICLE_AUTHOR_TAG;
    }

    public articleLinkTag(): string {
        return RssParsingContext.ARTICLE_LINK_TAG;
    }

    public articleTitleTag(): string {
        return RssParsingContext.ARTICLE_TITLE_TAG;
    }

    public articleContentTag(): string {
        return RssParsingContext.ARTICLE_CONTENT_TAG;
    }

    public articlePublishedDateTag(): string {
        return RssParsingContext.ARTICLE_PUBLISHED_DATE_TAG;
    }
}
