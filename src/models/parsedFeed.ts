import type Article from "./article";
import type Source from "./source";

/**
 * @description Represents a parsed feed.
 */
export default interface ParsedFeed {
    source: Source;
    articles: Article[];
}