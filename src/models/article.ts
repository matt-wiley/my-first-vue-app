/**
 *  @description Represents an item from an RSS source
 */
export default interface Article {
    externalId: string;
    title: string;
    date: Date;
    author: string;
    link: string;
    content: string;
}
