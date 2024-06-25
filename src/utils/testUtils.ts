import { useUIStateStore } from "@/stores/ui";
import { readFileSync } from "fs";
import { vi } from "vitest";
import SampleDataUtils from "./sampleDataUtils";
import StringUtils from "./stringUtils";
import type ParsedFeed from "@/models/parsedFeed";


export default class TestUtils {

  /**
   * Reads the content of a file
   * 
   * @param filePath The path to the file to read
   * @returns The content of the file
   */
  static parseXmlToDocument(filePath: string) {
    const xmlContent = readFileSync(filePath, "utf8");
    return new DOMParser().parseFromString(xmlContent, "text/xml");
  }

  /**
   *  Mocks the fetchFeed function to return the content of the XML file
   * 
   * @param targetUrl The URL to fetch
   * @param mockDataPath The path to the XML file to return
   */
  static async mockFetchFeed(targetUrl: string, mockDataPath: string) {
    vi.mock("src/services/feedFetchService", () => {
      return {
        fetchFeed: async (url: string) => {
          if (url !== targetUrl) {
            throw new Error("Invalid URL");
          }
          return TestUtils.parseXmlToDocument(mockDataPath);
        },
      };
    });
  }

  /**
   * Mocks the parseFeed function to return the provided result
   * 
   * @param parseResult The result of parsing a feed
   */
  static mockParseFeed(parseResult: ParsedFeed) {
    vi.mock("src/services/feedParserService", () => {
      return {
        parseFeed: (feedDoc: Document) => {
          return parseResult;
        },
      };
    });
  }

  /**
   * Generates a random URL for testing
   * 
   * @returns A random URL for testing
   */
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