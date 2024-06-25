
import type ArticleEntity from "@/models/articleEntity";
import type SourceEntity from "@/models/sourceEntity";
import DateUtils from "@/utils/dateUtils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import InMemoryContentStore from "../inMemoryContentStore";


[
  InMemoryContentStore
].forEach(contentStore => {

  setActivePinia(createPinia()); // Initialize the underlying store before test suite setup
  const storeUnderTest = contentStore.getInstance();

  describe(storeUnderTest.getStoreId(), () => {

    beforeEach(() => {  
      setActivePinia(createPinia()); // Reset the undelying store before each test
    });

    it("adds a basic source", async () => {
      const source: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl",
      };

      // Verify that the values are as expected
      const addedSourceEntity = await storeUnderTest.addSource(source);
      expect(addedSourceEntity).toBeDefined();
      expect(addedSourceEntity.id).toMatch(/^S-[a-f0-9]{40}$/);
      expect(addedSourceEntity.title).toBe("title");
      expect(addedSourceEntity.description).toBe("description");
      expect(addedSourceEntity.feedUrl).toBe("feedUrl");
      expect(addedSourceEntity.url).toBeUndefined();

      // Verify that the store has the expected values
      expect(storeUnderTest.getAllSources().length).toBe(1);
      expect(storeUnderTest.getAllSources()[0]).toBe(addedSourceEntity);

    });

    it("throws an error when adding a source with a undefined title", async () => {
        const source: Partial<SourceEntity> = {
          title: undefined,
          description: "description",
          feedUrl: "feedUrl",
        };

        await expect(storeUnderTest.addSource(source)).rejects.toThrow("source.title cannot be null or undefined");
    });

    it("throws an error when adding a source with a undefined feedUrl", async () => {   
      setActivePinia(createPinia()); 
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: undefined,
        };

        await expect(storeUnderTest.addSource(source)).rejects.toThrow("source.feedUrl cannot be null or undefined");
    });

    it("throws an error when adding a source with the same feedUrl", async () => {
      const source: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl",
      };

      await storeUnderTest.addSource(source);
      expect(storeUnderTest.getAllSources().length).toBe(1);

      await expect(storeUnderTest.addSource(source)).rejects.toThrow("source.feedUrl must be unique");
      expect(storeUnderTest.getAllSources().length).toBe(1);
    });

    it("gets a source by id", async () => {
      const source: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl",
      };

      const addedSourceEntity = await storeUnderTest.addSource(source);
      const foundSourceEntity = await storeUnderTest.getSourceById(addedSourceEntity.id);
      expect(foundSourceEntity).toBeDefined();
      expect(foundSourceEntity).toBe(addedSourceEntity);
    });

    it("getting a source by id returns undefined when source does not exist", async () => {
      const foundSourceEntity = await storeUnderTest.getSourceById("S-123");
      expect(foundSourceEntity).toBeUndefined();
    });

    it("returns the correct number of total sources", async () => {
      const source1: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl1",
      };
      await storeUnderTest.addSource(source1);
      expect(await storeUnderTest.getSourcesCount()).toBe(1);

      const source2: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl2",
      };
      await storeUnderTest.addSource(source2);
      expect(await storeUnderTest.getSourcesCount()).toBe(2);
    });

    it("deletes a source", async () => {
      const source1: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl1",
      };
      const addedSourceEntity1 = await storeUnderTest.addSource(source1);
      expect(await storeUnderTest.getSourcesCount()).toBe(1);

      const source2: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl2",
      };
      const addedSourceEntity2 = await storeUnderTest.addSource(source2);
      expect(await storeUnderTest.getSourcesCount()).toBe(2);

      await storeUnderTest.deleteSource(addedSourceEntity1.id);
      expect(await storeUnderTest.getSourcesCount()).toBe(1);

      await storeUnderTest.deleteSource(addedSourceEntity2.id);
      expect(await storeUnderTest.getSourcesCount()).toBe(0);
    });

    it("deletes all sources", async () => { 
      const source1: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl1",
      };
      await storeUnderTest.addSource(source1);
      expect(await storeUnderTest.getSourcesCount()).toBe(1);

      const source2: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl2",
      };
      await storeUnderTest.addSource(source2);
      expect(await storeUnderTest.getSourcesCount()).toBe(2);

      await storeUnderTest.deleteAllSources();
      expect(await storeUnderTest.getSourcesCount()).toBe(0);

    });

    it("clears the store", async () => {
      const source: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl",
      };

      await storeUnderTest.addSource(source);
      expect(storeUnderTest.getAllSources().length).toBe(1);

      storeUnderTest.clearStore();
      expect(storeUnderTest.getAllSources().length).toBe(0);
    });

    it("adds a basic article", async () => {  
      const source: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl",
      };

      const addedSourceEntity = await storeUnderTest.addSource(source);

      const article: Partial<ArticleEntity> = {
        sourceId: addedSourceEntity.id,    
        externalId: "externalId",
        title: "title",
        date: DateUtils.randomDate(new Date("01/01/2024"),new Date()),
        author: "author",
        link: "link",
        content: "content",
      };

      // Verify that the values are as expected
      const addedArticleEntity = await storeUnderTest.addArticle(article);
      expect(addedArticleEntity).toBeDefined();
      expect(addedArticleEntity.id).toMatch(/^A-[a-f0-9]{40}$/);
      expect(addedArticleEntity.sourceId).toBe(addedSourceEntity.id);
      expect(addedArticleEntity.externalId).toBe("externalId");
      expect(addedArticleEntity.title).toBe("title");
      expect(addedArticleEntity.date).toBe(article.date);
      expect(addedArticleEntity.author).toBe("author");
      expect(addedArticleEntity.link).toBe("link");
      expect(addedArticleEntity.content).toBe("content");


      // Verify that the store has the expected values
      expect(storeUnderTest.getAllArticles().length).toBe(1);
      expect(storeUnderTest.getAllArticles()[0]).toBe(addedArticleEntity);
    });

    it("adds a basic article without an externalId", async () => {
      const source: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl",
      };

      const addedSourceEntity = await storeUnderTest.addSource(source);

      const article: Partial<ArticleEntity> = {
        sourceId: addedSourceEntity.id,
        externalId: undefined,
        title: "title",
        date: DateUtils.randomDate(new Date("01/01/2024"),new Date()),
      }

      // Verify that the values are as expected
      const addedArticleEntity = await storeUnderTest.addArticle(article);
      expect(addedArticleEntity).toBeDefined();
      expect(addedArticleEntity.id).toMatch(/^A-[a-f0-9]{40}$/);
      expect(addedArticleEntity.sourceId).toBe(addedSourceEntity.id);
      expect(addedArticleEntity.externalId).toBeUndefined();
      expect(addedArticleEntity.title).toBe("title");
      expect(addedArticleEntity.date).toBe(article.date);
      expect(addedArticleEntity.author).toBeUndefined();
      expect(addedArticleEntity.link).toBeUndefined();
      expect(addedArticleEntity.content).toBeUndefined();

      // Verify that the store has the expected values
      expect(storeUnderTest.getAllArticles().length).toBe(1);
      expect(storeUnderTest.getAllArticles()[0]).toBe(addedArticleEntity);

    });

    it("adds a basic article without a title", async () => {
      const source: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl",
      };

      const addedSourceEntity = await storeUnderTest.addSource(source);

      const article: Partial<ArticleEntity> = {
        sourceId: addedSourceEntity.id,
        externalId: "externalId",
        title: undefined,
        date: DateUtils.randomDate(new Date("01/01/2024"),new Date()),
      }

      // Verify that the values are as expected
      const addedArticleEntity = await storeUnderTest.addArticle(article);
      expect(addedArticleEntity).toBeDefined();
      expect(addedArticleEntity.id).toMatch(/^A-[a-f0-9]{40}$/);
      expect(addedArticleEntity.sourceId).toBe(addedSourceEntity.id);
      expect(addedArticleEntity.externalId).toBe("externalId");
      expect(addedArticleEntity.title).toBeUndefined(); // TODO: Should this be required?
      expect(addedArticleEntity.date).toBe(article.date);
      expect(addedArticleEntity.author).toBeUndefined();
      expect(addedArticleEntity.link).toBeUndefined();
      expect(addedArticleEntity.content).toBeUndefined(); // TODO: Should this be required?

      // Verify that the store has the expected values
      expect(storeUnderTest.getAllArticles().length).toBe(1);
      expect(storeUnderTest.getAllArticles()[0]).toBe(addedArticleEntity);
    });

    it("throws an error when adding an article with an undefined sourceId", async () => {
      const article: Partial<ArticleEntity> = {
        sourceId: undefined,
        externalId: "externalId",
        title: "title",
        date: DateUtils.randomDate(new Date("01/01/2024"),new Date()),
      };

      await expect(storeUnderTest.addArticle(article)).rejects.toThrow("article.sourceId cannot be null or undefined");
    });

    it("throws an error when adding an article with an undefined externalId and title", async () => {
      const source: Partial<SourceEntity> = {
        title: "title",
        description: "description",
        feedUrl: "feedUrl",
      };

      const addedSourceEntity = await storeUnderTest.addSource(source);

      const article: Partial<ArticleEntity> = {
        sourceId: addedSourceEntity.id,
        externalId: undefined,
        title: undefined,
        date: DateUtils.randomDate(new Date("01/01/2024"),new Date()),
      };

      await expect(storeUnderTest.addArticle(article)).rejects.toThrow("article.externalId or article.title must be set");
    });

  });

});

