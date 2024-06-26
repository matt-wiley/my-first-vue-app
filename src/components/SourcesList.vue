<script setup lang="ts">
import { contentStore } from '@/stores/contentStore';
import type ContentStoreInterface from '@/stores/contentStoreInterface';
import { useUIStateStore } from '@/stores/ui';

const uiState = useUIStateStore();
const content = contentStore as ContentStoreInterface
const contentState = content.getReactiveContentStore();

function handleClick(sourceId?: string) {
    if (uiState.getSelectedSourceId !== sourceId) {
        uiState.setSelectedSourceId(sourceId);
        uiState.setSelectedArticleId(undefined);
    }
}

function handleStyles(sourceId?: string) {
    if (sourceId === null) {
        return {
            'selected': uiState.getSelectedSourceId === undefined,
            'idle': uiState.getSelectedSourceId !== undefined
        }
    }
    return {
        'selected': uiState.getSelectedSourceId === sourceId,
        'idle': uiState.getSelectedSourceId !== sourceId
    }
}
</script>

<template>
  <section v-if="content.getSourcesCount()" id="sources-list-container">
    <h3>Sources</h3>
    <ul class="list ma0 pa0">
        <li class="list-item ma1 pa1 pl2 br2 pointer"
            id="S-all"
            :class="handleStyles()"
            @click="handleClick()"
            >All</li>
        <li class="list-item ma1 pa1 pl2 br2 pointer"
            :id="source.id"
            :class="handleStyles(source.id)"
            @click="handleClick(source.id)"
            v-for="source in content.getAllSources()" 
            :key="source.id"
            >{{ source.title }}</li>
    </ul>
  </section>
  <section v-else id="no-sources-container">
    <p>Add a source to get started!</p>
  </section>
</template>

<style scoped>
.list-item {
  color: var(--primary-text-color);
}

.idle {
  background-color: var(--primary-color);
}

.idle:hover {
  background-color: var(--blue-highlight);
}

.selected {
  background-color: var(--blue-lowlight);
}
</style>
