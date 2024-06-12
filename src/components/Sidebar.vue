<script setup lang="ts">
import { defineStore } from 'pinia';
import SourcesList from './SourcesList.vue'
import { SampleDataService } from '@/services/sample-data-service';

const dataService = SampleDataService.getInstance();


</script>

<template>
  <div id="sidebar" class="">
    <SourcesList v-bind:sources=dataService.getSources() />
  </div>
</template>

<style scoped>
</style>
