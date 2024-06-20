import type Freshness from "./freshness";
import type Article from "./article";

/**
 * @description Represents an article record in the datastore.
 */
export default interface ArticleRecord extends Article {
    sha: string; 
    id: string;
    sourceId: string;
    isTombstoned: boolean; // soft delete    
    freshness: Freshness; // meta-presence in XML feed and datastore
}