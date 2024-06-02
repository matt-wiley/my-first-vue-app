<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">Home</router-link>
      </nav>
    </header>

    <router-view />
  </div>
</template>

<style scoped>
</style>
