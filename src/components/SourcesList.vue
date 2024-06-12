<script setup lang="ts">
import type { Source } from '@/interfaces/source';

defineProps<{
  sources: Source[];
}>();

</script>

<template>
  <section>
    <h3 class="ttc">Sources</h3>
    <ul class="list ma0 pa0">
        <li class="scoped-li-style ma1 pa1 pl2 br2 pointer"
            v-for="source in sources" 
            :key="source.id"
            >{{ source.title }}</li>
    </ul>
  </section>
</template>

<style scoped>
.scoped-li-style {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
}

.scoped-li-style:hover {
  background-color: var(--blue-highlight);
  color: var(--primary-text-color);
}


</style>
