<script setup lang="ts">
import type { OptionalArray, OptionalString } from "@/utils/optionalTypeUtils";
import ValidationUtils from "@/utils/validationUtils";
import { reactive } from "vue";
import FeedParserService from "@/services/feedParserService";
import { useContentStore } from "@/stores/content";

const vu = ValidationUtils;
const feedParser = FeedParserService.getInstance();
const content = useContentStore();

const state = reactive({
  // State Values
  showAddSourceForm: false,
  sourceUrl: undefined,
  errors: [],
} as {
  // State Types
  showAddSourceForm: boolean;
  sourceUrl: OptionalString;
  errors: OptionalArray<string>;
});


function resetState() {
  state.showAddSourceForm = false;
  state.sourceUrl = null;
  state.errors = [];
}

function handleStyleForInput() {
  return {
    'bg-pink-200': state.errors!.length > 0 || false,
    'b--red': state.errors!.length > 0 || false,
    'red': state.errors!.length > 0 || false,
  };
}

function toggleAddSourceForm() {
  // console.log(`toggleAddSourceForm: ${state.showAddSourceForm}`);
  state.showAddSourceForm = !state.showAddSourceForm;
  if (!state.showAddSourceForm) {
    state.sourceUrl = null;
    resetState();
  }
}

async function addNewSource() {
  console.log(`addNewSource: ${state.sourceUrl}`);

  if (state.sourceUrl !== null && vu.isValidUrl(state.sourceUrl)) {
    try{
      const feedData = await feedParser.fetchAndParseFeed(state.sourceUrl);
      if (feedData !== null) {
        const sourceRecord = await content.addSource(feedData.source);
        for (const article of feedData.articles) {
          content.addArticle(sourceRecord, article);
        }
        toggleAddSourceForm();
      }
    } catch (error: any) {
      console.error(`Error adding source: ${error}`);
      state.errors = [ error.message ];
    }
  } else {
    state.errors = ["Invalid URL. Please enter a valid URL."];
  }
}

</script>

<template>
  <div class="relative">
    <button class="button bn pointer mr1 br2 pa2" title="Add Source" @click="toggleAddSourceForm()">
      <i class="fas fa-plus"></i>
    </button>
    <div class="skrim" :class="{
      dn: !state.showAddSourceForm
    }">&nbsp;</div>
    <div class="form-adjustments bg-white pa3 br2 shadow-5" :class="{
      dn: !state.showAddSourceForm,
      'flex flex-column justify-start': state.showAddSourceForm,
    }">
      <h3 class="modal-header mb3 br2 pv1 ph2"><i class="fas fa-plus"></i> Add Source</h3>
      <input v-model="state.sourceUrl" 
        class="ba b--silver mh2 pa2 br2" 
        :class="handleStyleForInput()"
        placeholder="Paste URL" />
      <div class="flex flex-row justify-start mh1 mt1">
        <ul class="list pa0">
          <li v-for="error in state.errors" :key="error" class="red ph2">{{ error }}</li>
        </ul>
      </div>
      <div class="flex flex-row justify-end mh1 mt3">
        <button class="bn mr1 br2 pv2 ph3" :class="{
          'button-disabled': !vu.isValidUrl(state.sourceUrl),
          'button': vu.isValidUrl(state.sourceUrl),
          'pointer': vu.isValidUrl(state.sourceUrl),
        }" :disabled="!vu.isValidUrl(state.sourceUrl)" title="Add Source" @click="addNewSource()">
          Add
        </button>
        <button class="button-cancel pointer bn br2 pv2 ph3" title="Cancel" @click="toggleAddSourceForm()">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.button {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
}

.button:hover {
  background-color: var(--green-primary);
}

.button-cancel {
  background-color: #ff6f6f;
  color: var(--primary-text-color);
}

.button-cancel:hover {
  background-color: #ff4f4f;
}

.button-disabled {
  background-color: #cfcfcf;
  color: #afafaf;
  cursor: not-allowed;
}

.skrim {
  z-index: 900;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
}

.form-adjustments {
  z-index: 1000;
  position: fixed;
  inset: 0;
  width: 25%;
  height: fit-content;
  margin: auto;
}

.modal-header {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
}
</style>
