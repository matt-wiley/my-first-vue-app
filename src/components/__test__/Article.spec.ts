
import { mount } from "@vue/test-utils";
import { describe, expect, it, beforeEach } from "vitest";
import { useContentStore } from "@/stores/content";
import { useUIStateStore } from "@/stores/ui";
import SampleDataUtils from "@/utils/sampleDataUtils";
import StringUtils from "@/utils/stringUtils";
import Article from "../Article.vue";
import { createPinia, setActivePinia } from "pinia";
import DateUtils from "@/utils/dateUtils";


const getFeedUrlForTest = () => {
  return "https://www.example.com/" + StringUtils.randomStringOfLength(20);
}

const setupContentStore = async (piniaForTest: any) => {
  // This sets up the following scenario:
  // 
  // contentStore:
  //   sourceARecord:
  //     articleARecord: active
  //     articleBRecord: tombstoned
  //   sourceBRecord:
  //     articleCRecord: active

  const contentStore = useContentStore(piniaForTest);
  contentStore.sources = [];
  contentStore.articles = [];

  const feedAUrlForTest = getFeedUrlForTest();
  const feedBUrlForTest = getFeedUrlForTest();

  const sourceA = SampleDataUtils.generateSource();
  sourceA.feedUrl = feedAUrlForTest;
  const sourceARecord = await contentStore.addSource(sourceA);

  const sourceB = SampleDataUtils.generateSource();
  sourceB.feedUrl = feedBUrlForTest;
  const sourceBRecord = await contentStore.addSource(sourceB);

  const articleA = SampleDataUtils.generateArticle();
  const articleARecord = await contentStore.addArticle(sourceARecord, articleA);

  const articleB = SampleDataUtils.generateArticle();
  const articleBRecord = await contentStore.addArticle(sourceARecord, articleB);
  contentStore.deleteArticle(articleBRecord);

  const articleC = SampleDataUtils.generateArticle();
  const articleCRecord = await contentStore.addArticle(sourceBRecord, articleC);

  return {
    contentStore: contentStore,
    sourceARecord: sourceARecord,
    sourceBRecord: sourceBRecord,
    articleARecord: articleARecord,
    articleBRecord: articleBRecord,
    articleCRecord: articleCRecord
  };
}

const setupUiStore = async (piniaForTest: any, selectedArticleId: string | undefined = undefined) => {
  const uiStateStore = useUIStateStore(piniaForTest);
  uiStateStore.setSelectedArticleId(selectedArticleId);
  return {
    uiStateStore: uiStateStore
  }
}



describe("Article.vue", () => {
  
  it("renders properly when an article is selected", async () => {
    
    const piniaForTest = setActivePinia(createPinia());
    const contentStoreSetup = await setupContentStore(piniaForTest);
    await setupUiStore(piniaForTest, contentStoreSetup.articleARecord.id);

    const wrapper = mount(Article, {});
    
    // Article section should be rendered
    expect(wrapper.find("section").exists()).toBe(true);
    
    // Article content should be rendered
    expect(wrapper.find("#article-title").exists()).toBe(true);
    expect(wrapper.find("#article-title").element.tagName).toEqual("H2");
    expect(wrapper.find("#article-title").text()).toBe(contentStoreSetup.articleARecord.title);

    expect(wrapper.find("#article-author").exists()).toBe(true);
    expect(wrapper.find("#article-author").element.tagName).toEqual("P");
    expect(wrapper.find("#article-author").element.innerHTML).toBe(contentStoreSetup.articleARecord.author);

    expect(wrapper.find("#article-date").exists()).toBe(true);
    expect(wrapper.find("#article-date").element.tagName).toEqual("P");

    expect(contentStoreSetup.articleARecord.date).toBeInstanceOf(Date); 
    // @ts-ignore
    const expectedDate = DateUtils.presentDateAsMMMM_DD_YYYY_HH_MM_AMPM(contentStoreSetup.articleARecord.date);
    expect(wrapper.find("#article-date").text()).toBe(expectedDate);

    expect(wrapper.find("#article-content").exists()).toBe(true);
    expect(wrapper.find("#article-content").element.tagName).toEqual("DIV");
    expect(wrapper.find("#article-content").element.innerHTML).toBe(contentStoreSetup.articleARecord.content);

    expect(wrapper.find("#article-footer-whitespace").exists()).toBe(true);
    expect(wrapper.find("#article-footer-whitespace").element.tagName).toEqual("DIV");
    expect(wrapper.find("#article-footer-whitespace").element.innerHTML).toEqual("&nbsp;");

    // No article selected message should not be rendered
    expect(wrapper.find("#no-article").exists()).toBe(false);

  });


  it("renders properly when no article is selected", async () => {

    const piniaForTest = setActivePinia(createPinia());
    await setupUiStore(piniaForTest, undefined);

    expect(useUIStateStore().selectedArticleId).toBe(undefined);

    const wrapper = mount(Article, {});

    // Article section should be rendered
    expect(wrapper.find("section").exists()).toBe(true);
    
    // Article content should not be rendered
    expect(wrapper.find("#article-title").exists()).toBe(false);
    expect(wrapper.find("#article-author").exists()).toBe(false);
    expect(wrapper.find("#article-date").exists()).toBe(false);
    expect(wrapper.find("#article-content").exists()).toBe(false);
    expect(wrapper.find("#article-footer-whitespace").exists()).toBe(false);

    // No article selected message should be rendered
    expect(wrapper.find("#no-article").exists()).toBe(true);
    expect(wrapper.find("#no-article").element.tagName).toEqual("P");
    expect(wrapper.find("#no-article").text()).toBe("No article selected");

  });

});
