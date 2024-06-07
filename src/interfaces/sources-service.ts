import type { Source } from "./source";

export interface SourcesServiceInterface {
    addSource(source: Source): void;
    getSources(): Array<Source>;
}