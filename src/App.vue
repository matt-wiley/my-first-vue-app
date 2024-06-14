<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import { useUIStateStore } from "./stores/ui";

(() => {
    // Setup the global stores
    const uiState = useUIStateStore();

    // @ts-ignore
    window.stores = { uiState };
})();


</script>

<template>
    <div id="app" class="flex flex-column vh-100">
        <header class="scoped-header-style">
            <h1 class="tc">RSS READER</h1>
        </header>
        <div id="ui-columns" class="flex flex-row vh-100">
            <div class="scoped-far-west-column-style pa2 w-20">
                <Sidebar />
            </div>
            <div class="scoped-west-column-style pa3 w-20">
                <h1>Articles</h1>
            </div>
            <main class="scoped-main-column-style pa3 w-60 justify-start items-stretch">
                <router-view />
            </main>
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
