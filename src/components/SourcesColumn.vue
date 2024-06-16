<script setup lang="ts">
import SourcesList from './SourcesList.vue'
import AddSourceButton from './AddSourceButton.vue'

import { useContentStore } from '@/stores/content';
import { useUIStateStore } from '@/stores/ui';

const uiState = useUIStateStore();
const content = useContentStore();


function addSource() {
    console.log('addSource');
    // TODO: Implement addSource function
}

</script>

<template>
    <div class="flex flex-column">
        <div class="flex flex-row justify-start">
            <AddSourceButton />
        </div>
        <SourcesList />
    </div>
</template>

<style scoped>
</style>