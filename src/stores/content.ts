import { defineStore } from "pinia";
// @ts-ignore
import { useInMemoryContentStore } from "./inMemoryContent";
// @ts-ignore
import { useLocalStorageContentStore } from "./localStorageContent";

export const useContentStore = (() => {
  // return useInMemoryContentStore;
  return useLocalStorageContentStore
})();
