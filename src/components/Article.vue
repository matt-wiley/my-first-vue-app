<script setup lang="ts">
import type { Article } from "@/models/article";
import { Freshness } from "@/models/freshness";
import { useContentStore } from "@/stores/content";
import { useUIStateStore } from "@/stores/ui";
import DateUtils from "@/utils/dateUtils";

const uiState = useUIStateStore();
const content = useContentStore();

const componentState = { article: null as Article | null };

function getSelectedArticle() {
    return content.getArticle(uiState.getSelectedArticleId) as Article | null;
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
                    <p>isTombstoned = {{ getSelectedArticle()?.isTombstoned }}</p>
                    <p>freshness = {{ getSelectedArticle()?.freshness }}</p>
                </div>
                <p>{{ getSelectedArticle()?.content }}</p>
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
