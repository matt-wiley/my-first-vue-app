<script setup lang="ts">
import { contentStore } from "./stores/contentStore";
import { useUIStateStore } from "./stores/ui";
import FeedFetchService from './services/feedFetchService';
import FeedParserService from './services/feedParserService';
import AtomParserService from './services/atomParserService';
import router from './router';

(() => {
  // Setup the global stores
  const uiState = useUIStateStore();
  const content = contentStore.getReactiveContentStore();

  // TODO: Make this conditional on env variable
  // content.initSampleData(); 

  // TODO: Make this conditional on env variable
  // @ts-ignore
  window.stores = {
    uiState,
    content
  };

  // @ts-ignore
  window.feedFetch = FeedFetchService.getInstance()

  // @ts-ignore
  window.feedParse = FeedParserService.getInstance();

  // @ts-ignore
  window.atomParser = AtomParserService;

})();


</script>

<template>
  <div class="flex flex-column justify-start">
    <div class="flex flex-row justify-start">
      <router-link v-for="route in $router.options.routes" :key="route.path" :to="route.path" class="bn mr1 br2 pv2 ph3">{{ route.name }}</router-link>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.scoped-header-style {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
}

.scoped-far-west-column-style {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
}

.scoped-west-column-style {
  background-color: var(--articles-list-bg-color);
  color: var(--secondary-text-color);
}

.scoped-main-column-style {
  background-color: var(--content-area-bg-color);
  color: var(--content-page-text-color);
}
</style>
