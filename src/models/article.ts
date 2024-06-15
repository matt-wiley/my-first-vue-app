import type { Freshness } from "./freshness";

export interface Article {
    sha256: string; //article id
    sourceId: string;
    author: string;
    link: string;
    title: string;
    content: string;
    publishedDate: Date;
    isTombstoned: boolean; // soft delete    
    freshness: Freshness;
}