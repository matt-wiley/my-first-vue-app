import type ArticleRecord from "@/models/articleRecord";
import type Source from "@/models/source";
import type { SourceRecord } from "@/models/sourceRecord";
import HashUtils, { HashAlgo } from "@/utils/hashUtils";
import StringUtils from "@/utils/stringUtils";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

type ContentEntries = {[key: string]: ContentEntry}
type ContentEntry = SourceRecord | ArticleRecord;

const _contentStoreDefinition = (() => {

  const KEY_SOURCE_IDS_LIST: string = "mfva-rss.content.sourceIdsList";
  const KEY_ARTICLE_IDS_LIST: string = "mfva-rss.content.articleIdsList";
  const KEY_CONTENT_ENTRIES: string = "mfva-rss.content.entries";

  return defineStore({
    id: "content",

    hydrate: (currentState: any) => {
      currentState.sourcesKeys = useLocalStorage<string[]>(KEY_SOURCE_IDS_LIST, []);
      currentState.articlesKeys = useLocalStorage<string[]>(KEY_ARTICLE_IDS_LIST, []);

      for (const key of currentState.sourcesKeys.value) {
        try {
          const source = useLocalStorage<SourceRecord>(key, {} as SourceRecord, {
            onError: (e) => {
              throw new Error(`Error loading source ${key}: ${e}`);
            }
          });
          currentState.entities[key] = source;
        }
        catch (e) {
          console.error(`Error loading source ${key}: ${e}`); 
          continue;
        }
      }

      for (const key of currentState.articlesKeys.value) {
        try {
          const article = useLocalStorage<ArticleRecord>(key, {} as ArticleRecord, {
            onError: (e) => {
              throw new Error(`Error loading article ${key}: ${e}`);
            }
          });
          currentState.entities[key] = article;
        }
        catch (e) {
          console.error(`Error loading article ${key}: ${e}`); 
          continue;
        }
      }
    },

    state: () => ({
      sourcesKeys: useLocalStorage<string[]>(KEY_SOURCE_IDS_LIST, []),
      articlesKeys: useLocalStorage<string[]>(KEY_ARTICLE_IDS_LIST, []),
      entities: useLocalStorage<ContentEntries>(KEY_CONTENT_ENTRIES, {} as ContentEntries)
    }),

    getters: {
      getAllSources: (state) => {
        return state.sourcesKeys.map((key: any) => state.entities[key]);
      }
    },

    actions: {
      async addSourceKey(sourceKey: string): Promise<void> {
        this.sourcesKeys.push(sourceKey);
      },
      async addSource(source: Source): Promise<SourceRecord> {

        const sourceRecord = { ...source } as SourceRecord;
        if (StringUtils.isEmpty(sourceRecord.feedUrl)) {
          throw new Error("Feed URL is required");
        }
        const hash = await HashUtils.digest(HashAlgo.SHA1, sourceRecord.feedUrl);
        sourceRecord.id = `S-${hash}`;

        this.addSourceKey(sourceRecord.id);

        this.entities[sourceRecord.id] = sourceRecord;
        return sourceRecord;
      }
    }

  });

})();


export const useLocalStorageContentStore = _contentStoreDefinition