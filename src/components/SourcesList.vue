<script setup lang="ts">
import type { Source } from '@/interfaces/source';
import { useUIStateStore } from '@/stores/ui';

defineProps<{
  sources: Source[];
}>();

const uiState = useUIStateStore();

</script>

<template>
  <section>
    <h3>Sources</h3>
    <ul class="list ma0 pa0">
        <li class="list-item ma1 pa1 pl2 br2 pointer"
            :class="{ 
                'selected': uiState.getSelectedSourceId === null,
                'idle': uiState.getSelectedSourceId !== null
            }"
            @click="uiState.setSelectedSourceId(null)"
            >All</li>
        <li class="list-item ma1 pa1 pl2 br2 pointer"
            :class="{ 
                'selected': uiState.getSelectedSourceId === source.id,
                'idle': uiState.getSelectedSourceId !== source.id
            }"
            v-for="source in sources" 
            :key="source.id"
            @click="uiState.setSelectedSourceId(source.id)"
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
