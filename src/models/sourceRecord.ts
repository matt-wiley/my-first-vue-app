import type { Source } from "./source";

/**
 * Represents a source record in the datastore.
 */
export interface SourceRecord extends Source {
    id: string;
}