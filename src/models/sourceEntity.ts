

/**
 * @description Represents a source record in the datastore.
 */
export default interface SourceEntity {
    id: string;
    title: string;
    feedUrl: string;
    url: string;
    description: string;
}