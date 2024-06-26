<script setup lang="ts">
import type ArticleEntity from '@/models/articleEntity';
import Freshness from '@/models/freshness';
import type SourceEntity from '@/models/sourceEntity';
import InMemoryContentStore from '@/stores/inMemoryContentStore';
import type { Maybe } from '@/types/maybe';
import SampleDataUtils from '@/utils/sampleDataUtils';
import { reactive } from 'vue';

const contentStoreWrapper = InMemoryContentStore.getInstance()

const sourceEntityToAdd = reactive({
  id: undefined,
  title: undefined,
  feedUrl: undefined,
  url: undefined,
  description: undefined
} as {
  id: Maybe<string>;
  title: Maybe<string>;
  feedUrl: Maybe<string>;
  url: Maybe<string>;
  description: Maybe<string>;
})


/*
sha: string; // hash of the article
id: string; // generated id
sourceId: string; // id of the source feed
isTombstoned: boolean; // soft delete    
freshness: Freshness; // meta-presence in XML feed and datastore
externalId?: string; // id from feed item / entry
title: string;
date: Date;
author: string;
link: string;
content: string;
*/

const articleEntityToAdd = reactive({
  sourceId: undefined,
  id: undefined,
  externalId: undefined,
  title: undefined,
  date: undefined,
  author: undefined,
  link: undefined,
  content: undefined,
  freshness: Freshness.New,
  isTombstoned: false
} as {
  sourceId: Maybe<string>;
  id: Maybe<string>;
  externalId?: Maybe<string>;
  title: Maybe<string>;
  date: Maybe<Date>;
  author: Maybe<string>;
  link: Maybe<string>;
  content: Maybe<string>;
  freshness: Freshness;
  isTombstoned: boolean;
})




async function addSource() {
  const addedSource = await contentStoreWrapper.addSource({
    id: sourceEntityToAdd.id,
    title: sourceEntityToAdd.title,
    feedUrl: sourceEntityToAdd.feedUrl,
    url: sourceEntityToAdd.url,
    description: sourceEntityToAdd.description
  } as SourceEntity)
  sourceEntityToAdd.id = addedSource.id
}

function generateRandomSource() {
  const randomSource = SampleDataUtils.generateSource()
  sourceEntityToAdd.title = randomSource.title
  sourceEntityToAdd.feedUrl = randomSource.feedUrl
  sourceEntityToAdd.url = randomSource.url
  sourceEntityToAdd.description = randomSource.description
}

function clearSourceEntityToAdd() {
  sourceEntityToAdd.id = undefined
  sourceEntityToAdd.title = undefined
  sourceEntityToAdd.feedUrl = undefined
  sourceEntityToAdd.url = undefined
  sourceEntityToAdd.description = undefined
}

function attempt(operation: () => any){
  try {
    operation()
  } catch (error) {
    console.error(error)
  }
}

async function addArticle() {
    const addedArticle = await contentStoreWrapper.addArticle({
      sourceId: articleEntityToAdd.sourceId,
      id: articleEntityToAdd.id,
      externalId: articleEntityToAdd.externalId,
      title: articleEntityToAdd.title,
      date: articleEntityToAdd.date,
    } as ArticleEntity);
    articleEntityToAdd.id = addedArticle.id
}

async function updateArticle() {
  const updatedArticle = await contentStoreWrapper.updateArticle({
    sourceId: articleEntityToAdd.sourceId,
    externalId: articleEntityToAdd.externalId,
    title: articleEntityToAdd.title,
    date: articleEntityToAdd.date,
  } as ArticleEntity);
}


function generateRandomArticle() {
  const randomArticle = SampleDataUtils.generateArticle()
  articleEntityToAdd.title = randomArticle.title
  articleEntityToAdd.date = randomArticle.date
  articleEntityToAdd.author = randomArticle.author
  articleEntityToAdd.link = randomArticle.link
  articleEntityToAdd.content = randomArticle.content
}

function clearArticleEntityToAdd() {
  articleEntityToAdd.sourceId = undefined
  articleEntityToAdd.id = undefined
  articleEntityToAdd.externalId = undefined
  articleEntityToAdd.title = undefined
  articleEntityToAdd.date = undefined
  articleEntityToAdd.author = undefined
  articleEntityToAdd.link = undefined
  articleEntityToAdd.content = undefined
}

</script>


<template>
  <div class="pt4">
    <div class="pv3 ph3">
      <h2 class="f4">Content Store</h2>
      <p><code>{{ contentStoreWrapper.getStoreId() }}</code></p>
    </div>
    <div class="pv3 ph3">
      <h3 class="f5 mv3">Content Entry Forms</h3>
      <h4 class="mv2">Add SourceEntity to Content Store</h4>
      <div class="bn br2 bg-silver pa3 w-50">
        <div class="flex flex-row justify-start mb3">
          <button class="pointer bn br2 pv2 w-20 mr1" @click="generateRandomSource()">Randomize</button>
          <button class="pointer bn br2 pv2 w-20" @click="clearSourceEntityToAdd()">Clear</button>
        </div>
        <input class="w-100 bn br2 pa1 mb2" v-model="sourceEntityToAdd.id" placeholder="sourceEntity.id" />
        <input class="w-100 bn br2 pa1 mb2" v-model="sourceEntityToAdd.title" placeholder="sourceEntity.title" />
        <input class="w-100 bn br2 pa1 mb2" v-model="sourceEntityToAdd.feedUrl" placeholder="sourceEntity.feedUrl" />
        <input class="w-100 bn br2 pa1 mb2" v-model="sourceEntityToAdd.url" placeholder="sourceEntity.url" />
        <input class="w-100 bn br2 pa1 mb2" v-model="sourceEntityToAdd.description"
          placeholder="sourceEntity.description" />
        <div class="flex flex-row justify-end mt3">
          <button class="pointer bn br2 pv2 w-20 mr1" disabled @click="">Get</button>
          <button class="pointer bn br2 pv2 w-20 mr1" @click="attempt(addSource)">Add</button>
          <button class="pointer bn br2 pv2 w-20 mr1" disabled @click="">Update</button>
          <button class="pointer bn br2 pv2 w-20 mr1" disabled @click="">Delete</button>
        </div>
      </div>
      <h4 class="mv2">Add ArticleEntity to Content Store</h4>
      <div class="bn br2 bg-silver pa3 w-50">
        <div class="flex flex-row justify-start mb3">
          <button class="pointer bn br2 pv2 w-20 mr1" @click="generateRandomArticle()">Randomize</button>
          <button class="pointer bn br2 pv2 w-20" @click="clearArticleEntityToAdd()">Clear</button>
        </div>
        <input class="w-100 bn br2 pa1 mb2" v-model="articleEntityToAdd.sourceId"
          placeholder="articleEntity.sourceId" />
        <input class="w-100 bn br2 pa1 mb2" v-model="articleEntityToAdd.id" placeholder="articleEntity.id" />
        <input class="w-100 bn br2 pa1 mb2" v-model="articleEntityToAdd.title" placeholder="articleEntity.title" />
        <input class="w-100 bn br2 pa1 mb2" v-model="articleEntityToAdd.date" placeholder="articleEntity.date" />
        <input class="w-100 bn br2 pa1 mb2" v-model="articleEntityToAdd.author" placeholder="articleEntity.author" />
        <input class="w-100 bn br2 pa1 mb2" v-model="articleEntityToAdd.link" placeholder="articleEntity.link" />
        <input class="w-100 bn br2 pa1 mb2" v-model="articleEntityToAdd.content" placeholder="articleEntity.content" />
        <select class="w-100 bn br2 pa1 mb2" v-model="articleEntityToAdd.freshness">
          <option value="New">New</option>
          <option value="Current">Current</option>
          <option value="Stale">Stale</option>
        </select>
        <div class="w-100 bn br2 pa1 mb2">
          <input name="tombstone" type="checkbox" class="dib bn br2" v-model="articleEntityToAdd.isTombstoned" />
          <label for="tombstone" class="dib ml2 dark-gray">Tombstone</label>
        </div>

        <div class="flex flex-row justify-end mt3">
          <button class="pointer bn br2 pv2 w-20 mr1" disabled @click="">Get</button>
          <button class="pointer bn br2 pv2 w-20 mr1" @click="attempt(addArticle)">Add</button>
          <button class="pointer bn br2 pv2 w-20 mr1" disabled @click="updateArticle()">Update</button>
          <button class="pointer bn br2 pv2 w-20 mr1" disabled @click="">Delete</button>
        </div>
      </div>
    </div>
    <div class="pv3 ph3">
      <h3 class="f5 mv3">Content</h3>
      <div class="flex flex-row justify-stretch">
        <div>
          <ul>
            <li v-for="source in contentStoreWrapper.getAllSources()" :key="source.id">
              <code>
                {{ JSON.stringify(source) }}
              </code>
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li v-for="article in contentStoreWrapper.getAllArticles()" :key="article.id">
              <code>
                {{ JSON.stringify(article) }}
              </code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>


</template>


<style scoped></style>