<script setup lang="ts">
import SourcesList from './components/SourcesList.vue';
import ArticlesList from './components/ArticlesList.vue';
import Article from './components/Article.vue';
import { useContentStore } from './stores/content';
import { useUIStateStore } from "./stores/ui";

(() => {
    // Setup the global stores
    const uiState = useUIStateStore();
    const content = useContentStore();
    content.initSampleData(); // TODO: Make this conditional on env variable 

    // @ts-ignore
    window.stores = { // TODO: Make this conditional on env variable
        uiState,
        content
    };

})();


</script>

<template>
    <div id="app" class="vh-100 overflow-hidden">
        <div class="flex flex-column h-100">
            <header class="scoped-header-style">
                <h1 class="tc">RSS READER</h1>
            </header>
            <div id="ui-columns" class="flex flex-row flex-grow-1 h-100">
                <div class="scoped-far-west-column-style pa2 w-20 overflow-x-hidden overflow-y-scroll">
                    <SourcesList />
                </div>
                <div class="scoped-west-column-style pa2 w-20 overflow-x-hidden overflow-y-scroll">
                    <ArticlesList />
                </div>
                <main class="scoped-main-column-style pa0 w-60 justify-start items-stretch">
                    <Article />
                </main>
            </div>
        </div>
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
