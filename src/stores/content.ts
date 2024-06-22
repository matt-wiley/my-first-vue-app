import { useInMemoryContentStore } from "./inMemoryContent";
import { useLocalStorageContentStore } from "./localStorageContent";

export const useContentStore = (() => {
  return useInMemoryContentStore;
  // return useLocalStorageContentStore
})();