<script setup lang="ts">
import type { Source } from '@/interfaces/source';

defineProps<{
  sources: Source[];
}>();



</script>

<template>
  <ul class="list ma0 pa0">
    <li class="ma2 pa0" v-for="source in sources" :key="source.id">
      {{ source.title }}
    </li>
  </ul>
</template>

<style scoped>
</style>
