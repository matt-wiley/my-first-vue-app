import type Source from "./source";

/**
 * @description Represents a source record in the datastore.
 */
export interface SourceRecord extends Source {
    id: string;
}