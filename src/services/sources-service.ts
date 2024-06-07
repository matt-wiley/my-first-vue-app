import type { Source } from "@/interfaces/source";
import type { SourcesServiceInterface } from "@/interfaces/sources-service";


export class SourcesService implements SourcesServiceInterface {

    private sources: Array<Source>;

    constructor() {
        this.sources = [];
    }

    addSource(source: Source) {
        this.sources.push(source);
    }

    getSources() {
        return this.sources;
    }
}
