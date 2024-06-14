import { defineStore } from "pinia";


interface UIState {
    selectedSourceId: string | null;
    selectedArticleId: string | null;
}

export const useUIStateStore = defineStore({
    id: "ui",

    state: () => ({
        selectedSourceId: null,
        selectedArticleId: null,
    } as UIState),

    getters: {
        getSelectedSourceId: (state) => state.selectedSourceId,
        getSelectedArticleId: (state) => state.selectedArticleId,
    },

    actions: {
        setSelectedSourceId(sourceId: string | null) {
            this.selectedSourceId = sourceId;
        },
        setSelectedArticleId(articleId: string | null) {
            this.selectedArticleId = articleId;
        },
    },
});
