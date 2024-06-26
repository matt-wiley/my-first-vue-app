<script setup lang="ts">
import SourcesList from './SourcesList.vue'
import AddSourceButton from './AddSourceButton.vue'

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