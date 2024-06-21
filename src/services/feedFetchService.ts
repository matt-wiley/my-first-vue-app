
type RssFeedUrl = string;

interface RssParserResultCacheEntry {
    lastUpdated: Date;
    data: Document;
}

class RssParserResultCache {

    private cache: Map<RssFeedUrl,RssParserResultCacheEntry>  = new Map<RssFeedUrl,RssParserResultCacheEntry>();

    public get(url: RssFeedUrl): RssParserResultCacheEntry | undefined {
        return this.cache.get(url);
    }

    public put(url: RssFeedUrl, entry: RssParserResultCacheEntry) {
        this.cache.set(url, entry);
    }

    public clear() {
        this.cache.clear();
    }

    public remove(url: RssFeedUrl) {
        this.cache.delete(url);
    }

    public has(url: RssFeedUrl): boolean {
        return this.cache.has(url);
    }

    public size(): number {
        return this.cache.size;
    }

    public keys(): IterableIterator<RssFeedUrl> {
        return this.cache.keys();
    }

    public isStale(url: RssFeedUrl, maxAge: number): boolean {
        const entry = this.get(url);
        if (entry === undefined) return true;
        const now = new Date();
        const elapsed = now.getTime() - entry.lastUpdated.getTime();
        return elapsed > maxAge;
    }

}

/**
 * Service for fetching and caching feed data.
 */
export default class FeedFetchService {

    private readonly CACHE_MAX_AGE = 1000 * 60 * 60; // 1 hour
    private static instance: FeedFetchService;
    private CACHE: RssParserResultCache;

    private constructor() {
        this.CACHE = new RssParserResultCache();
    }

    public static getInstance(): FeedFetchService {
        if (!FeedFetchService.instance) {
            FeedFetchService.instance = new FeedFetchService();
        }
        return FeedFetchService.instance;
    }

    /**
     * Fetch the feed data from the given URL and return it as a Document object.
     * 
     * @param url The URL of the feed to fetch
     * @returns The feed data as a Document object parsed by a DOMParser
     */
    private async fetchFeedData(url: RssFeedUrl): Promise<Document> {
        const feedXml = await fetch("https://shuttle-rftnh5bqzq-uc.a.run.app", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ target: url }),
          })
          .then((response) => response.text());

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(feedXml.trim(), "text/xml");
        return xmlDoc;
    }

    /**
     * Update the feed data for the given URL. If the data is already cached 
     * and not stale, the cached data is returned.
     * 
     * @param url The URL of the feed to update
     * @returns The feed data as a Document object parsed by a DOMParser
     */
    public async fetchFeed(url: RssFeedUrl): Promise<Document> {
        if (this.CACHE.has(url) && !this.CACHE.isStale(url, this.CACHE_MAX_AGE)) {
            return this.CACHE.get(url)!.data;
        }

        const feed = await this.fetchFeedData(url);

        this.CACHE.put(url, { lastUpdated: new Date(), data: feed });

        return feed;
    }

    /**
     * Clear the cache of feed data.
     */
    public clearCache() {
        this.CACHE.clear();
    }

}