<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div id="app" class="flex flex-row vh-100">
    <div class="w-20 bg-red">
      <Sidebar />
    </div>
    <div class="w-80 bg-silver">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
</style>
