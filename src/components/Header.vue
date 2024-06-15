<script setup lang="ts">
import { useContentStore } from '@/stores/content';

const content = useContentStore();

const buttonActions = [
    {
        title: "Refresh",
        icon: "fas fa-rotate",
        action: () => {
            content.initSampleData();
        }
    },
    {
        title: "Scroll to top",
        icon: "fas fa-circle-up",
        action: () => {
            window.scrollTo(0, 0);
        }
    }
];


</script>


<template>
    <div class="flex flex-row">
        <h1 class="tc dib ml4 mr3 ">RSS READER</h1>
        <div class="flex flex-row justify-end items-center">
            <button 
                v-for="button in buttonActions"
                class="button pointer mr1 br2 pa2" 
                :title="button.title"
                @click="button.action"
                >
                <i :class="button.icon"></i>
            </button>
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