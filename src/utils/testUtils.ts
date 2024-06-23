import { useUIStateStore } from "@/stores/ui";
import SampleDataUtils from "./sampleDataUtils";
import StringUtils from "./stringUtils";



export default class TestUtils {


  static getFeedUrlForTest() {
    return "https://www.example.com/" + StringUtils.randomStringOfLength(20);
  }
  
  static async setupContentStore(config: { 
    piniaForTest: any;
    contentStoreLoader: (pinia: any) => any;
  }) {
    // This sets up the following scenario:
    // 
    // contentStore:
    //   sourceARecord:
    //     articleARecord: active
    //     articleBRecord: tombstoned
    //   sourceBRecord:
    //     articleCRecord: active
  
    const contentStore = config.contentStoreLoader(config.piniaForTest);
    contentStore.clearAll();
  
    const feedAUrlForTest = TestUtils.getFeedUrlForTest();
    const feedBUrlForTest = TestUtils.getFeedUrlForTest();
  
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
  
  static setupUiStore(
    config: { piniaForTest: any; selectedSourceId?: string | undefined; selectedArticleId?: string | undefined; }) {
    const uiStateStore = useUIStateStore(config.piniaForTest);
    uiStateStore.setSelectedSourceId(config.selectedSourceId);
    uiStateStore.setSelectedArticleId(config.selectedArticleId);
    return {
      uiStateStore: uiStateStore
    }
  }

}