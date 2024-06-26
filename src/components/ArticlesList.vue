<script setup lang="ts">
import type ArticleEntity from "@/models/articleEntity";
import type ArticleRecord from "@/models/articleRecord";
import { contentStore } from "@/stores/contentStore";
import { useUIStateStore } from '@/stores/ui';
import type { Maybe } from "@/types/maybe";

const uiState = useUIStateStore();
const content = contentStore


/**
 * Get the filtered list of articles to display
 * 
 * @returns The filtered list of articles to display
 */
function getArticlesForSelectedSource(): ArticleRecord[] {
    if (uiState.getSelectedSourceId) {
        return content.getArticlesForSourceId(uiState.getSelectedSourceId);
    } else {
        return content.getAllArticles();
    }
}

/**
 * Check if there are any articles to display
 * 
 * @returns True if there are articles to display, false otherwise
 */
function hasArticles(): boolean {
    return getArticlesForSelectedSource().slice().length > 0
}

/**
 * Get the list of articles to display
 * 
 * @returns The list of articles to display, sorted by date descending
 */
function getPresentableArticles(): ArticleEntity[] {
    const _dateDescending = (a: ArticleRecord, b: ArticleRecord) => {
      const bTime = ( typeof b.date === 'string' ? new Date(b.date) : b.date ).getTime();
      const aTime = ( typeof a.date === 'string' ? new Date(a.date) : a.date ).getTime();
      return bTime - aTime;
    }
    /* 
     * We need to slice the array to make a copy of it, otherwise the sort will modify the original array
     * causing the UI to rerender every time the list is sorted. This leads to a warning in the console about
     * "possible infinite loop in render function"
     * 
     * ref: https://stackoverflow.com/a/67733729/25577406
     */
    return getArticlesForSelectedSource().slice().sort(_dateDescending);
}

/**
 * Handle the click event on an article
 * 
 * @param articleId The id of the article that was clicked
 */
function handleClick(articleId: Maybe<string>) {
    // If the article is not already selected, select it
    if (uiState.getSelectedArticleId !== articleId) {
        uiState.setSelectedArticleId(articleId);
    }
}

/**
 * Handle the styles for the article list
 * 
 * @param articleId The id of the article to style
 * @returns The styles to apply to the article list
 */
function handleStyles(articleId: string | null) {
    return {
        'selected': uiState.getSelectedArticleId === articleId,
        'idle': uiState.getSelectedArticleId !== articleId
    }
}

</script>

<template>
    <div class="ma0 pa0 w-100 h-100">
        <h3>Articles</h3>
        <section v-if="hasArticles()" class="ma0 pa0">
            <ul class="list ma0 pa0">
                <li class="list-item ma1 pa1 pl2 br2 pointer" 
                    :class="handleStyles(article.id)" 
                    v-for="article in getPresentableArticles()" 
                    :key="article.id" 
                    @click="handleClick(article.id)"
                    >{{ article.title }}</li>
            </ul>
            <div class="vh-75 w-100">&nbsp;</div>
        </section>
        <section v-else class="ma0 pa0">
            <!-- TODO: Make a better empty list message. -->
            <p class="tc pa2">No articles for selected source</p>
        </section>
    </div>
</template>

<style scoped>
.list-item {
    color: var(--primary-text-color);
}

.idle {
    background-color: var(--primary-color);
}

.idle:hover {
    background-color: var(--blue-highlight);
}

.selected {
    background-color: var(--blue-lowlight);
}
</style>
