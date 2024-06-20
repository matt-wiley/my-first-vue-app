import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core"

type OptionalString = string | undefined

const _uiStateStoreDefinition = (() => {

    const KEY_SELECTED_SOURCE_ID: string = "mfva-rss.ui.selectedSourceId"
    const KEY_SELECTED_ARTICLE_ID: string  = "mfva-rss.ui.selectedArticleId"

    return defineStore({
        id: "ui",

        hydrate: (currentState, initialState) => {
            // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
            currentState.selectedSourceId = useLocalStorage<OptionalString>(KEY_SELECTED_SOURCE_ID, undefined)
            // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
            currentState.selectedArticleId = useLocalStorage<OptionalString>(KEY_SELECTED_ARTICLE_ID, undefined)
        },

        state: () => ({
            selectedSourceId: useLocalStorage<OptionalString>(KEY_SELECTED_SOURCE_ID, undefined),
            selectedArticleId: useLocalStorage<OptionalString>(KEY_SELECTED_ARTICLE_ID, undefined),
        }),
    
        getters: {
            getSelectedSourceId: (state) => state.selectedSourceId,
            getSelectedArticleId: (state) => state.selectedArticleId,
        },
    
        actions: {
            setSelectedSourceId(sourceId?: string) {
                this.selectedSourceId = sourceId;
            },
            setSelectedArticleId(articleId?: string) {
                this.selectedArticleId = articleId;
            },
        },
    });

})();


export const useUIStateStore = _uiStateStoreDefinition
