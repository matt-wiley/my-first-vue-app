<script setup lang="ts">
import { ValidationUtils as vu } from "@/utils/validationUtils";
import { useContentStore } from "@/stores/content";
import { reactive } from "vue";

const content = useContentStore();

const state = reactive({
    showAddSourceForm: false,
    sourceUrl: null,
});

function toggleAddSourceForm() {
    console.log(`toggleAddSourceForm: ${state.showAddSourceForm}`);
    state.showAddSourceForm = !state.showAddSourceForm;
    if (!state.showAddSourceForm) {
        state.sourceUrl = null;
    }
}

function addNewSource() {
    console.log(`addNewSource: ${state.sourceUrl}`);
}

</script>

<template>
    <div class="relative">
        <button
            class="button bn pointer mr1 br2 pa2"
            title="Add Source"
            @click="toggleAddSourceForm()"
        >
            <i class="fas fa-plus"></i>
        </button>
        <div 
            class="skrim"
            :class="{
                dn: !state.showAddSourceForm
            }"
        >&nbsp;</div>
        <div
            class="form-adjustments bg-white pa3 br2 shadow-5"
            :class="{
                dn: !state.showAddSourceForm,
                'flex flex-column justify-start': state.showAddSourceForm,
            }"
        >
            <h3 class="modal-header mb3 br2 pv1 ph2"><i class="fas fa-plus"></i> Add Source</h3>
            <input
                v-model="state.sourceUrl"
                class="ba b--silver mh2 pa2 br2"
                placeholder="Paste URL"
            />
            <div class="flex flex-row justify-end mh1 mt3">
                <button
                    class="bn mr1 br2 pv2 ph3"
                    :class="{
                        'button-disabled': !vu.isValidUrl(state.sourceUrl),
                        'button': vu.isValidUrl(state.sourceUrl),
                        'pointer': vu.isValidUrl(state.sourceUrl),
                    }"
                    :disabled="!vu.isValidUrl(state.sourceUrl)"
                    title="Add Source"
                    @click="toggleAddSourceForm()"
                >
                    Add
                </button>
                <button
                    class="button-cancel pointer bn br2 pv2 ph3"
                    title="Cancel"
                    @click="toggleAddSourceForm()">
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
