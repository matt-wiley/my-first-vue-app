/**
 *  Represents an item from an RSS source
 */
export interface Article {
    author: string;
    link: string;
    title: string;
    content: string;
    publishedDate: Date;
}
