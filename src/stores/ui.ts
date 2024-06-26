import type { Maybe } from "@/types/maybe";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core"



const _uiStateStoreDefinition = (() => {

    const KEY_SELECTED_SOURCE_ID: string = "mfva-rss.ui.selectedSourceId"
    const KEY_SELECTED_ARTICLE_ID: string  = "mfva-rss.ui.selectedArticleId"

    return defineStore({
        id: "ui",

        hydrate: (currentState) => {
            // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
            currentState.selectedSourceId = useLocalStorage<OptionalString>(KEY_SELECTED_SOURCE_ID, undefined)
            // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
            currentState.selectedArticleId = useLocalStorage<OptionalString>(KEY_SELECTED_ARTICLE_ID, undefined)
        },

        state: () => ({
            selectedSourceId: useLocalStorage<Maybe<string>>(KEY_SELECTED_SOURCE_ID, undefined),
            selectedArticleId: useLocalStorage<Maybe<string>>(KEY_SELECTED_ARTICLE_ID, undefined),
        }),
    
        getters: {
            getSelectedSourceId: (state) => state.selectedSourceId,
            getSelectedArticleId: (state) => state.selectedArticleId,
        },
    
        actions: {
            setSelectedSourceId(sourceId: Maybe<string>) {
                this.selectedSourceId = sourceId;
            },
            setSelectedArticleId(articleId: Maybe<string>) {
                this.selectedArticleId = articleId;
            },
        },
    });

})();


export const useUIStateStore = _uiStateStoreDefinition
