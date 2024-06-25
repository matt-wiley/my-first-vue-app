import type Freshness from "@/models/freshness";

/**
 * @description Represents an article entity in the datastore.
 */
export default interface ArticleEntity {
    sha: string; // hash of the article
    id: string; // generated id
    sourceId: string; // id of the source feed
    isTombstoned: boolean; // soft delete    
    freshness: Freshness; // meta-presence in XML feed and datastore
    externalId?: string; // id from feed item / entry
    title: string;
    date: Date;
    author: string;
    link: string;
    content: string;
}