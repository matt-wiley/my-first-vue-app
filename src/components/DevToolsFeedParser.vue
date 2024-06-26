<script setup lang="ts">
import type ParsedFeed from '@/models/parsedFeed';
import FeedParserService from '@/services/feedParserService';
import { reactive } from 'vue';

const state = reactive({
  sourceXml: undefined,
  parseFeed: undefined,
  errors: []
} as {
  sourceXml: string | null | undefined;
  parseFeed: ParsedFeed | null | undefined;
  errors: string[];
});

function resetState() {
  state.sourceXml = undefined;
  state.errors = [];
  state.parseFeed = undefined;
}

function handleStyleForInput() {
  return {
    'bg-pink-200': state.errors!.length > 0 || false,
    'b--red': state.errors!.length > 0 || false,
    'red': state.errors!.length > 0 || false,
  };
}

function parseSource() {
  if (state.sourceXml === null || state.sourceXml === undefined) {
    state.errors.push('No XML data to parse');
    return;
  }
  try {
    const xmlDoc = new DOMParser().parseFromString(state.sourceXml, 'text/xml');
    const result = FeedParserService.getInstance().parseFeed(xmlDoc); 
    state.parseFeed = result;
    console.dir(result)
  }
  catch (error: any) {
    state.errors.push(error.message);
  }
}

function clearOutput() {
  state.parseFeed = undefined;
}

</script>


<template>
  <div class="bg-silver ma4 ">
    <h3 class="modal-header mb3 br2 pv1 ph2 dark-gray">Parse Feed Data</h3>
      <textarea v-model="state.sourceXml" 
        class="ba b--silver center pa2 br2 w-100 h4" 
        placeholder="Paste XML" />
      <div class="flex flex-row justify-start mh1 mt1">
        <ul class="list pa0">
          <li v-for="error in state.errors" :key="error" class="red ph2">{{ error }}</li>
        </ul>
      </div>
      <div class="flex flex-row justify-end mh1 mt3">
        <button class="bn mr1 br2 pv2 ph3" title="Parse" @click="parseSource()">
          Parse
        </button>
        <button class="bn mr1 br2 pv2 ph3" title="Clear Output" @click="clearOutput()">
          Clear Output
        </button>
        <button class="bn mr1 br2 pv2 ph3" title="Clear All" @click="resetState()">
          Clear All
        </button>
      </div>
      <textarea class="mt3 h5 ba b--silver center pa2 br2 w-100 h5">
          {{ JSON.stringify(state.parseFeed, null, 2) }}
      </textarea>
  </div>
</template>


<style scoped>

</style>