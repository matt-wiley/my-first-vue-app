import type Source from "@/models/source";

/**
 * @description Represents a source record in the datastore.
 */
export default interface SourceRecord extends Source {
    id: string;
}