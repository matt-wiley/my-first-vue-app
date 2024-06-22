
import { useUIStateStore } from "@/stores/ui";
import DateUtils from "@/utils/dateUtils";
import TestUtils from "@/utils/testUtils";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import Article from "../Article.vue";


describe("Article.vue", () => {
  
  it("renders properly when an article is selected", async () => {
    
    const piniaForTest = setActivePinia(createPinia());
    const contentStoreSetup = await TestUtils.setupContentStore(piniaForTest);
    TestUtils.setupUiStore(piniaForTest, contentStoreSetup.articleARecord.id);

    const wrapper = mount(Article, {});
    
    // Article section should be rendered
    expect(wrapper.find("section").exists()).toBe(true);
    
    // Article content should be rendered
    expect(wrapper.find("#article-title").exists()).toBe(true);
    expect(wrapper.find("#article-title").text()).toBe(contentStoreSetup.articleARecord.title);

    expect(wrapper.find("#article-author").exists()).toBe(true);
    expect(wrapper.find("#article-author").element.innerHTML).toBe(contentStoreSetup.articleARecord.author);

    expect(wrapper.find("#article-date").exists()).toBe(true);

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
    TestUtils.setupUiStore(piniaForTest);

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
