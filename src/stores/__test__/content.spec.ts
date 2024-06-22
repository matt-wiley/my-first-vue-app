import HashUtils, { HashAlgo } from "@/utils/hashUtils";
import { SampleDataUtils } from "@/utils/sampleDataUtils";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { useContentStore } from "../content";
import { setActivePinia, createPinia } from "pinia";
import exp from "constants";
import StringUtils from "@/utils/stringUtils";


const getFeedUrlForTest = () => {
  return "https://www.example.com/"+StringUtils.randomStringOfLength(20);
}

describe("content", () => {

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("adds a source", async () => {
    const feedUrlForTest = getFeedUrlForTest()
    const contentStore = useContentStore();
    const source = SampleDataUtils.generateSource();
    source.feedUrl = feedUrlForTest
    const sourceRecord = await contentStore.addSource(source);

    expect(sourceRecord.description).toEqual(source.description);
    expect(sourceRecord.feedUrl).toEqual(feedUrlForTest);
    expect(sourceRecord.title).toEqual(source.title);
    expect(sourceRecord.id).toEqual(`S-${await HashUtils.digest(HashAlgo.SHA1, feedUrlForTest)}`);
    expect(sourceRecord.url).toEqual(source.url);

    expect(contentStore.sources).toContain(sourceRecord);
  });

  it("adds an article", async () => {
    const feedUrlForTest = getFeedUrlForTest()
    const contentStore = useContentStore();
    const source = SampleDataUtils.generateSource();
    source.feedUrl = feedUrlForTest
    const sourceRecord = await contentStore.addSource(source);

    const article = SampleDataUtils.generateArticle();
    const articleRecord = await contentStore.addArticle(sourceRecord, article);

    expect(articleRecord.author).toEqual(article.author);
    expect(articleRecord.content).toEqual(article.content);
    expect(articleRecord.date).toEqual(article.date);
    expect(articleRecord.link).toEqual(article.link);
    expect(articleRecord.title).toEqual(article.title);
    expect(articleRecord.id).toEqual(`A-${await HashUtils.digest(HashAlgo.SHA1, articleRecord.sha)}`);
    expect(articleRecord.sourceId).toEqual(sourceRecord.id);

    expect(contentStore.articles).toContain(articleRecord);
  });

  it("gets all sources", async () => {
    const feedUrlForTest = getFeedUrlForTest()
    const contentStore = useContentStore();

    const source = SampleDataUtils.generateSource();
    source.feedUrl = feedUrlForTest

    const sourceRecord = await contentStore.addSource(source);

    expect(contentStore.getAllSources.length).toEqual(1);
    expect(contentStore.getAllSources).toContain(sourceRecord);
  });

  it("gets all articles", async () => {
    const feedUrlForTest = getFeedUrlForTest()
    const contentStore = useContentStore();
    const source = SampleDataUtils.generateSource();
    source.feedUrl = feedUrlForTest;
    const sourceRecord = await contentStore.addSource(source);

    const article = SampleDataUtils.generateArticle();
    const articleRecord = await contentStore.addArticle(sourceRecord, article);

    expect(contentStore.getAllArticles.length).toEqual(1);
    expect(contentStore.getAllArticles).toContain(articleRecord);
  });

  it("gets articles", async () => {

    const feedUrlForTest = getFeedUrlForTest()
    const contentStore = useContentStore();
    const source = SampleDataUtils.generateSource();
    source.feedUrl = feedUrlForTest;
    const sourceRecord = await contentStore.addSource(source);

    const articleA = SampleDataUtils.generateArticle();
    const articleARecord = await contentStore.addArticle(sourceRecord, articleA);

    const articleB = SampleDataUtils.generateArticle();
    const articleBRecord = await contentStore.addArticle(sourceRecord, articleB);

    contentStore.deleteArticle(articleARecord);

    expect(contentStore.getArticles.length).toEqual(1);
    expect(contentStore.getArticles).toContain(articleBRecord);
  });

  // it("gets articles for source", async () => {
  //   const source = SampleDataUtils.generateSource();
  //   const sourceRecord = await contentStore.addSource(source);

  //   const article = SampleDataUtils.generateArticle();
  //   const articleRecord = await contentStore.addArticle(sourceRecord, article);
  //   expect(contentStore.getArticlesForSourceId(sourceRecord.id)).toContain(articleRecord);
  // });

  // it("gets article", async () => {
  //   const source = SampleDataUtils.generateSource();
  //   const sourceRecord = await contentStore.addSource(source);

  //   const article = SampleDataUtils.generateArticle();
  //   const articleRecord = await contentStore.addArticle(sourceRecord, article);
  //   expect(contentStore.getArticle(articleRecord.id)).toBe(articleRecord);
  // });

});