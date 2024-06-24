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
  <div class="w-100">
    <h3 class="modal-header mb3 br2 pv1 ph2">Parse Feed Data</h3>
      <textarea v-model="state.sourceXml" 
        class="ba b--silver center pa2 br2 w-80" 
        placeholder="Paste URL" />
      <div class="flex flex-row justify-start mh1 mt1">
        <ul class="list pa0">
          <li v-for="error in state.errors" :key="error" class="red ph2">{{ error }}</li>
        </ul>
      </div>
      <div class="flex flex-row justify-end mh1 mt3">
        <button class="bn mr1 br2 pv2 ph3" title="Add Source" @click="parseSource()">
          Parse
        </button>
        <button class="bn mr1 br2 pv2 ph3" title="Add Source" @click="clearOutput()">
          Clear
        </button>
      </div>
      <div class="flex flex-row justify-end mh1 mt3">
        <code>
          {{ JSON.stringify(state.parseFeed, null, 2) }}
        </code>  
      </div>
  </div>
</template>


<style scoped>

</style>