export interface Source {
    id: string;
    title: string;
    url: string;
    description: string;
}

export class SourcesService {

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
