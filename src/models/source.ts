/**
 * Represents an RSS feed source
 */
export interface Source {
    title: string;
    feedUrl: string;
    url?: string;
    description?: string;
}