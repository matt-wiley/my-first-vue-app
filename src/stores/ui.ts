import { defineStore } from "pinia";


export const useUIStateStore = defineStore({
  id: "ui",

  state: () => ({
    selectedSourceId: null,
    selectedArticleId: null,
  } as {
    selectedSourceId: string | null;
    selectedArticleId: string | null;
  }),

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
