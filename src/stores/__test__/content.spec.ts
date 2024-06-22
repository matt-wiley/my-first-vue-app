import Freshness from "@/models/freshness";
import HashUtils, { HashAlgo } from "@/utils/hashUtils";
import SampleDataUtils from "@/utils/sampleDataUtils";
import TestUtils from "@/utils/testUtils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useContentStore } from "../content";



describe("content", () => {

  it("adds a source", async () => {
    const piniaForTest = setActivePinia(createPinia());
    const feedUrlForTest = TestUtils.getFeedUrlForTest()
    const contentStore = useContentStore(piniaForTest);
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

  it("throws an error when adding a source with an empty feed URL", async () => {
    const piniaForTest = setActivePinia(createPinia());
    const contentStore = useContentStore(piniaForTest);
    const source = SampleDataUtils.generateSource();
    source.feedUrl = "";
    try {
      await contentStore.addSource(source);
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toEqual("Feed URL is required");
    }
  });

  it("adds an article", async () => {
    const piniaForTest = setActivePinia(createPinia());
    const feedUrlForTest = TestUtils.getFeedUrlForTest()
    const contentStore = useContentStore(piniaForTest);
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
    expect(articleRecord.sourceId).toEqual(sourceRecord.id);
    expect(articleRecord.sha).toEqual(await HashUtils.digest(HashAlgo.SHA256, `${articleRecord.sourceId}${articleRecord.title}${articleRecord.link}`));
    expect(articleRecord.id).toEqual(`A-${await HashUtils.digest(HashAlgo.SHA1, articleRecord.sha)}`);


    expect(contentStore.articles).toContain(articleRecord);
  });

  it("tombstones a non-Stale article on delete", async () => {
    const piniaForTest = setActivePinia(createPinia());
    const { contentStore, articleARecord } = await TestUtils.setupContentStore(piniaForTest);
    contentStore.deleteArticle(articleARecord);
    expect(articleARecord.isTombstoned).toBe(true);
  });

  it("removes Stale article on delete", async () => {
    const piniaForTest = setActivePinia(createPinia());
    const { contentStore, articleARecord } = await TestUtils.setupContentStore(piniaForTest);
    articleARecord.freshness = Freshness.Stale;
    contentStore.deleteArticle(articleARecord);

    expect(contentStore.getArticle(articleARecord.id)).toBe(undefined);
    expect(contentStore.getAllArticles).not.toContain(articleARecord);

  });

  it("gets all sources", async () => {
    const piniaForTest = setActivePinia(createPinia());
    const { contentStore, sourceARecord, sourceBRecord } = await TestUtils.setupContentStore(piniaForTest);

    expect(contentStore.getAllSources.length).toEqual(2);
    expect(contentStore.getAllSources).toContain(sourceARecord);
    expect(contentStore.getAllSources).toContain(sourceBRecord);
  });

  it("gets all articles (all including tombstoned)", async () => {
    const piniaForTest = setActivePinia(createPinia());
    const { contentStore, articleARecord, articleBRecord, articleCRecord } = await TestUtils.setupContentStore(piniaForTest);

    expect(contentStore.getAllArticles.length).toEqual(3);
    expect(contentStore.getAllArticles).toContain(articleARecord);
    expect(contentStore.getAllArticles).toContain(articleBRecord);
    expect(contentStore.getAllArticles).toContain(articleCRecord);
  });

  it("gets articles (all not tombstoned)", async () => {
    const piniaForTest = setActivePinia(createPinia());
    const { contentStore, articleARecord, articleBRecord, articleCRecord } = await TestUtils.setupContentStore(piniaForTest);

    expect(contentStore.getArticles.length).toEqual(2);
    expect(contentStore.getArticles).toContain(articleARecord);
    expect(contentStore.getArticles).toContain(articleCRecord);
    expect(contentStore.getArticles).not.toContain(articleBRecord);
  });

  it("gets articles for source", async () => {
    const piniaForTest = setActivePinia(createPinia());
    const { contentStore, sourceARecord, sourceBRecord, articleARecord, articleCRecord } = await TestUtils.setupContentStore(piniaForTest);

    expect(contentStore.getArticlesForSourceId(sourceARecord.id).length).toEqual(1);
    expect(contentStore.getArticlesForSourceId(sourceARecord.id)).toContain(articleARecord);

    expect(contentStore.getArticlesForSourceId(sourceBRecord.id).length).toEqual(1);
    expect(contentStore.getArticlesForSourceId(sourceBRecord.id)).toContain(articleCRecord);

    expect(contentStore.getArticlesForSourceId("nonexistent").length).toEqual(0);

  });

  it("gets article", async () => {
    const piniaForTest = setActivePinia(createPinia());
    const { contentStore, articleARecord, articleBRecord, articleCRecord } = await TestUtils.setupContentStore(piniaForTest);

    expect(contentStore.getArticle(articleARecord.id)).toBe(articleARecord);
    expect(contentStore.getArticle(articleBRecord.id)).toBe(articleBRecord);
    expect(contentStore.getArticle(articleCRecord.id)).toBe(articleCRecord);
    expect(contentStore.getArticle("nonexistent")).toBe(undefined);
    expect(contentStore.getArticle(undefined)).toBe(undefined);
  });

});