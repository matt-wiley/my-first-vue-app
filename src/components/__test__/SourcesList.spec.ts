import { useUIStateStore } from "@/stores/ui";
import DateUtils from "@/utils/dateUtils";
import TestUtils from "@/utils/testUtils";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import SourcesList from "../SourcesList.vue";
import { contentStore } from "@/stores/contentStore";
import { useLocalStorageContentStore } from "@/stores/localStorageContent";


describe("SourcesList.vue", () => {

  it("[TODO] Refactor to use an implementation of ContentStoreInterface", async () => {});

  // it("renders properly when sources are available", async () => {
  //   const piniaForTest = setActivePinia(createPinia());
  //   const contentStoreSetup = await TestUtils.setupContentStore({
  //     piniaForTest: piniaForTest,
  //     contentStoreLoader: useContentStore
  //   });

  //   const wrapper = mount(SourcesList, {});

  //   expect(wrapper.find("#sources-list-container").exists()).toBe(true);

  //   expect(wrapper.findAll("li").length).toBe(contentStoreSetup.contentStore.getAllSources.length + 1);
  //   expect(wrapper.findAll("li").at(0).text()).toBe("All");
  //   expect(wrapper.findAll("li").at(1).text()).toBe(contentStoreSetup.contentStore.getAllSources[0].title);
  //   expect(wrapper.findAll("li").at(2).text()).toBe(contentStoreSetup.contentStore.getAllSources[1].title);

  // });


  // it("renders properly when a source is selected", async () => {

  //   const piniaForTest = setActivePinia(createPinia());
  //   const contentStoreSetup = await TestUtils.setupContentStore({
  //     piniaForTest: piniaForTest,
  //     contentStoreLoader: useContentStore
  //   });
  //   const selectedSourceId = contentStoreSetup.contentStore.getAllSources[0].id;
  //   TestUtils.setupUiStore({
  //     piniaForTest: piniaForTest,
  //     selectedSourceId: selectedSourceId
  //   });

  //   const wrapper = mount(SourcesList, {});

  //   expect(wrapper.find("#no-sources-container").exists()).toBe(false);

  //   expect(wrapper.find("#sources-list-container").exists()).toBe(true);

  //   expect(wrapper.find("h3").exists()).toBe(true);
  //   expect(wrapper.find("h3").text()).toBe("Sources");

  //   expect(wrapper.findAll("li").length).toBe(contentStoreSetup.contentStore.getAllSources.length + 1);
  //   expect(wrapper.findAll("li").at(0).text()).toBe("All");
  //   expect(wrapper.findAll("li").at(1).text()).toBe(contentStoreSetup.contentStore.getAllSources[0].title);
  //   expect(wrapper.findAll("li").at(2).text()).toBe(contentStoreSetup.contentStore.getAllSources[1].title);

  //   // LI for "All" should be idle and not selected
  //   expect(wrapper.findAll("li").at(0).classes()).not.toContain("selected");
  //   expect(wrapper.findAll("li").at(0).classes()).toContain("idle");

  //   // LI Selected Source should be selected and not idle
  //   expect(wrapper.findAll("li").at(1).classes()).toContain("selected");
  //   expect(wrapper.findAll("li").at(1).classes()).not.toContain("idle");

  //   // LI for Other Source should be idle and not selected
  //   expect(wrapper.findAll("li").at(2).classes()).not.toContain("selected");
  //   expect(wrapper.findAll("li").at(2).classes()).toContain("idle");

  // });


  // it("renders properly when no sources are available", async () => {

  //   const piniaForTest = setActivePinia(createPinia());
  //   const contentStore = useContentStore(piniaForTest);
  //   contentStore.clearAll();
  //   TestUtils.setupUiStore({
  //     piniaForTest: piniaForTest
  //   });

  //   expect(useUIStateStore().selectedArticleId).toBe(undefined);

  //   const wrapper = mount(SourcesList, {});

  //   expect(wrapper.find("#sources-list-container").exists()).toBe(false);

  //   expect(wrapper.find("#no-sources-container").exists()).toBe(true);
  //   expect(wrapper.find("#no-sources-container").text()).toBe("Add a source to get started!");

  // });

});