<script setup lang="ts">
import type ParsedFeed from '@/models/parsedFeed';
import { useContentStore } from '@/stores/content';
import { reactive } from 'vue';

const content = useContentStore();

const state = reactive({
  userProvidedFeedData: undefined,
  parsedFeedData: undefined,
  errors: []
} as {
  userProvidedFeedData: string | null | undefined;
  parsedFeedData: ParsedFeed | null | undefined;
  errors: string[];
});


function refreshFeed() {

  if (state.userProvidedFeedData === null || state.userProvidedFeedData === undefined) {
    state.errors.push('No data provided for refresh');
    return;
  }

  try {
    const result = JSON.parse(state.userProvidedFeedData);
    state.parsedFeedData = result;
    console.dir(result)
  }
  catch (error: any) {
    state.errors.push(error.message);
  }

  content.refreshFeed(state.parsedFeedData);
}

</script>


<template>
  <div class="bg-silver ma4 ">
    <h3 class="modal-header mb3 br2 pv1 ph2 dark-gray">Refresh Feed with Data</h3>
      <textarea v-model="state.userProvidedFeedData" 
        class="ba b--silver center pa2 br2 w-100 h4" 
        placeholder="Paste " />
      <div class="flex flex-row justify-start mh1 mt1">
        <ul class="list pa0">
          <li v-for="error in state.errors" :key="error" class="red ph2">{{ error }}</li>
        </ul>
      </div>
      <div class="flex flex-row justify-end mh1 mt3">
        <button class="bn mr1 br2 pv2 ph3" title="Parse" @click="refreshFeed()">
          Refresh
        </button>
      </div>
      <textarea class="mt3 h5 ba b--silver center pa2 br2 w-100 h5">
          {{ JSON.stringify(state.parseFeed, null, 2) }}
      </textarea>
  </div>
</template>


<style scoped>

</style>