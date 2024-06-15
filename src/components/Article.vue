<script setup lang="ts">
import type { ArticleRecord } from "@/models/articleRecord";
import { useContentStore } from "@/stores/content";
import { useUIStateStore } from "@/stores/ui";
import DateUtils from "@/utils/dateUtils";

const uiState = useUIStateStore();
const content = useContentStore();

function getSelectedArticle() {
    return content.getArticle(uiState.getSelectedArticleId) as ArticleRecord | null;
}

function presentDate(date: Date | null | undefined) {
    if (!date) {
        return "";
    }
    return DateUtils.presentDateAsMMMM_DD_YYYY_HH_MM_AMPM(date);
}
</script>

<template>
    <div
        class="ma0 pa0 w-100 h-100 overflow-x-hidden overflow-y-scroll"
        v-bind:articleId="uiState.selectedArticleId"
    >
        <section class="" v-if="uiState.selectedArticleId !== null">
            <div class="br2 ml4 mt5 mr4 pa4 bg-white h-100">
                <h2 class="pb2">{{ getSelectedArticle()?.title }}</h2>
                <div class="pb4">
                    <p>{{ getSelectedArticle()?.author }}</p>
                    <p>
                        {{ presentDate(getSelectedArticle()?.publishedDate) }}
                    </p>  
                </div>
                <p>{{ getSelectedArticle()?.content }}</p>
                <div class="mt4">
                    <p>sha = {{ getSelectedArticle()?.sha }}</p>
                    <p>id = {{ getSelectedArticle()?.id }}</p>
                    <p>sourceId = {{ getSelectedArticle()?.sourceId }}</p>
                    <p>isTombstoned = {{ getSelectedArticle()?.isTombstoned }}</p>
                    <p>freshness = {{ getSelectedArticle()?.freshness }}</p>
                </div>
                <div class="vh-25 w-100">&nbsp;</div>
            </div>
        </section>
        <section v-else>
            <div class="br2 ml4 mt5 mr4 pa4 h-100">
                <p class="tc">No article selected</p>
            </div>
        </section>
    </div>
</template>

<style scoped></style>
