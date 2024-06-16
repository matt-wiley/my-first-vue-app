<script setup lang="ts">
import { useContentStore } from "@/stores/content";

const content = useContentStore();

function toggleAddSourceForm() {
    console.log(`toggleAddSourceForm: ${state.showAddSourceForm}`);
    state.showAddSourceForm = !state.showAddSourceForm;
}

function addNewSource() {
    console.log(`addNewSource: ${state.sourceUrl}`);
    state.showAddSourceForm = false;
}

const state = {
    showAddSourceForm: false,
    sourceUrl: null
}

</script>

<template>
    <div>
        <button
            class="button pointer mr1 br2 pa2"
            title="Add Source"
            @click="toggleAddSourceForm()"
        >
            <i class="fas fa-plus"></i>
        </button>
        <div class="flex flex-column justify-start" 
        :class="{
            'hidden': !state.showAddSourceForm,
            'flex flex-row justify-start items-center': state.showAddSourceForm
        }">
            <input v-model="state.sourceUrl" placeholder="Paste URL">
            <p>Url is: {{ state.sourceUrl }}</p>
            <button @click="addNewSource()">Add</button>
        </div>
    </div>
</template>

<style scoped>
.button {
    background-color: var(--primary-color);
    color: var(--primary-text-color);
    border: none;
}

.button:hover {
    background-color: var(--green-primary);
}
</style>
