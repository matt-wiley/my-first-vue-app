// import rssParser from 'rss-parser';


// type RssFeedUrl = string;

// interface RssParserResultCacheEntry {
//     lastUpdated: Date;
//     data: object;
// }

// class RssParserResultCache {

//     private cache: Map<RssFeedUrl,RssParserResultCacheEntry>  = new Map<RssFeedUrl,RssParserResultCacheEntry>();

//     public get(url: RssFeedUrl): RssParserResultCacheEntry | undefined {
//         return this.cache.get(url);
//     }

//     public put(url: RssFeedUrl, entry: RssParserResultCacheEntry) {
//         this.cache.set(url, entry);
//     }

//     public clear() {
//         this.cache.clear();
//     }

//     public remove(url: RssFeedUrl) {
//         this.cache.delete(url);
//     }

//     public has(url: RssFeedUrl): boolean {
//         return this.cache.has(url);
//     }

//     public size(): number {
//         return this.cache.size;
//     }

//     public keys(): IterableIterator<RssFeedUrl> {
//         return this.cache.keys();
//     }

//     public isStale(url: RssFeedUrl, maxAge: number): boolean {
//         const entry = this.get(url);
//         if (entry === undefined) return true;
//         const now = new Date();
//         const elapsed = now.getTime() - entry.lastUpdated.getTime();
//         return elapsed > maxAge;
//     }

// }


// export default class FeedFetchService {

//     private readonly CORS_PROXY = "https://cors-anywhere.herokuapp.com/"; // Provided by GitHub CoPilot, not sure if it's still necessary
//     private readonly CACHE_MAX_AGE = 1000 * 60 * 60; // 1 hour
//     private static instance: FeedUpdateService;
//     private CACHE: RssParserResultCache;

//     private constructor() {
//         this.CACHE = new RssParserResultCache();
//     }

//     public static getInstance(): FeedUpdateService {
//         if (!FeedUpdateService.instance) {
//             FeedUpdateService.instance = new FeedUpdateService();
//         }
//         return FeedUpdateService.instance;
//     }

//     public async updateFeed(url: RssFeedUrl): Promise<object> {
//         if (this.CACHE.has(url) && !this.CACHE.isStale(url, this.CACHE_MAX_AGE)) {
//             return this.CACHE.get(url)!.data;
//         }

//         const feed = await fetch(this.CORS_PROXY + url);
//         const result = feed as object;

//         this.CACHE.put(url, { lastUpdated: new Date(), data: result });

//         return result;
//     }

// }