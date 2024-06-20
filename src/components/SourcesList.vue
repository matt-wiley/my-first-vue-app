<script setup lang="ts">
import { useContentStore } from '@/stores/content';
import { useUIStateStore } from '@/stores/ui';

const uiState = useUIStateStore();
const content = useContentStore();

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
  <section>
    <h3>Sources</h3>
    <ul class="list ma0 pa0">
        <li class="list-item ma1 pa1 pl2 br2 pointer"
            :class="handleStyles()"
            @click="handleClick()"
            >All</li>
        <li class="list-item ma1 pa1 pl2 br2 pointer"
            :class="handleStyles(source.id)"
            @click="handleClick(source.id)"
            v-for="source in content.getAllSources" 
            :key="source.id"
            >{{ source.title }}</li>
    </ul>
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
