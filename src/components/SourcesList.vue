<script setup lang="ts">
import { useContentStore } from '@/stores/content';
import { useUIStateStore } from '@/stores/ui';

const uiState = useUIStateStore();
const content = useContentStore();

function handleClick(sourceId: string | null) {
    if (uiState.getSelectedSourceId !== sourceId) {
        uiState.setSelectedSourceId(sourceId);
        uiState.setSelectedArticleId(null);
    }
}

function handleStyles(sourceId: string | null) {
    if (sourceId === null) {
        return {
            'selected': uiState.getSelectedSourceId === null,
            'idle': uiState.getSelectedSourceId !== null
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
            :class="handleStyles(null)"
            @click="handleClick(null)"
            >All</li>
        <li class="list-item ma1 pa1 pl2 br2 pointer"
            :class="handleStyles(source.id)"
            @click="handleClick(source.id)"
            v-for="source in content.getSources" 
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
