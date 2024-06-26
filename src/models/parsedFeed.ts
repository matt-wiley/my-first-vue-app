import type Article from "@/models/article";
import type Source from "@/models/source";

/**
 * @description Represents a parsed feed.
 */
export default interface ParsedFeed {
    source: Source;
    articles: Article[];
}