
import type ArticleEntity from "@/models/articleEntity";
import Freshness from "@/models/freshness";
import type SourceEntity from "@/models/sourceEntity";
import DateUtils from "@/utils/dateUtils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import InMemoryContentStore from "../inMemoryContentStore";

[
  InMemoryContentStore,
  // LocalStorageContentStore,
  // IndexedDbContentStore,
].forEach(contentStore => {

  setActivePinia(createPinia()); // Initialize the underlying store before test suite setup
  const storeUnderTest = contentStore.getInstance();

  describe(storeUnderTest.getStoreId(), () => {

    beforeEach(() => {
      setActivePinia(createPinia()); // Reset the undelying store before each test
    });

    //
    // Store API
    //

    describe("clearStore()", () => {

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

    });

    //
    // Sources API
    //

    describe("addSource()", () => {

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

        try {
          await storeUnderTest.addSource(source);
          expect(true).toBe(false); // Should not reach this line
        }
        catch (error: any) {
          expect(error.message).toBe("source.feedUrl cannot be null or undefined");
        }
      });

      it("throws an error when adding a source with the same feedUrl", async () => {
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl",
        };

        await storeUnderTest.addSource(source);
        expect(storeUnderTest.getAllSources().length).toBe(1);

        try {
          await storeUnderTest.addSource(source);
          expect(true).toBe(false); // Should not reach this line
        }
        catch (error: any) {
          expect(error.message).toBe("source.feedUrl must be unique");
        }
        expect(storeUnderTest.getAllSources().length).toBe(1);
      });

    });

    describe("getSourceById()", () => {

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

      it("returns undefined when source does not exist", async () => {
        const foundSourceEntity = await storeUnderTest.getSourceById("S-123");
        expect(foundSourceEntity).toBeUndefined();
      });

    });

    describe("updateSource()", () => {

      it("updates a source", async () => {
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl",
        };

        const addedSourceEntity = await storeUnderTest.addSource(source);
        await storeUnderTest.updateSource({
          ...addedSourceEntity,
          title: "updated title",
        });

        const foundSourceEntity = await storeUnderTest.getSourceById(addedSourceEntity.id);
        expect(foundSourceEntity).toBeDefined();
        expect(foundSourceEntity?.id).toBe(addedSourceEntity.id);
        expect(foundSourceEntity?.title).toBe("updated title");
        expect(foundSourceEntity?.description).toBe("description");
        expect(foundSourceEntity?.feedUrl).toBe("feedUrl");

      });

      it("throws an error when updating a source that does not exist", async () => {
        try {
          await storeUnderTest.updateSource({
            id: "S-123",
            title: "updated title",
            description: "updated description",
            feedUrl: "updated feedUrl",
            url: "updated url",
          });
          expect(true).toBe(false); // Should not reach this line
        }
        catch (error: any) {
          expect(error.message).toBe("Source with id S-123 not found");
        }
      });
    });

    describe("deleteSource()", () => {

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

      it("throws an error when deleting a source that does not exist", async () => {
        try {
          await storeUnderTest.deleteSource("S-123");
          expect(true).toBe(false); // Should not reach this line
        }
        catch (error: any) {
          expect(error.message).toBe("Source with id S-123 not found");
        }
      });

    });

    describe("getAllSources()", () => {

      it("gets all sources", async () => {
        const source1: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl1",
        };
        const addedSourceEntity1 = await storeUnderTest.addSource(source1);

        const source2: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl2",
        };
        const addedSourceEntity2 = await storeUnderTest.addSource(source2);

        const allSources = storeUnderTest.getAllSources();
        expect(allSources.length).toBe(2);
        expect(allSources).toContain(addedSourceEntity1);
        expect(allSources).toContain(addedSourceEntity2);
      });

    });

    describe("getSourcesCount()", () => {

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

    });

    describe("deleteAllSources()", () => {

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

        const deleteCount = await storeUnderTest.deleteAllSources();
        expect(await storeUnderTest.getSourcesCount()).toBe(0);
        expect(deleteCount).toBe(2);

      });

    });

    //
    // Articles API
    //

    describe("addArticle()", () => {

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
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
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
        expect(addedArticleEntity.freshness).toBe(Freshness.New);


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
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
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
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
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
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        try {
          await storeUnderTest.addArticle(article);
          expect(true).toBe(false); // Should not reach this line
        }
        catch (error: any) {
          expect(error.message).toBe("article.sourceId cannot be null or undefined");
        }
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
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        try {
          await storeUnderTest.addArticle(article);
          expect(true).toBe(false); // Should not reach this line
        }
        catch (error: any) {
          expect(error.message).toBe("article.externalId or article.title must be set");
        }
      });

      it("throws an error when adding an article with an externalId and title that are empty strings", async () => {
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl",
        };

        const addedSourceEntity = await storeUnderTest.addSource(source);

        const article: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity.id,
          externalId: "",
          title: "",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        try {
          await storeUnderTest.addArticle(article);
          expect(true).toBe(false); // Should not reach this line
        }
        catch (error: any) {
          expect(error.message).toBe("article.externalId or article.title must be set");
        }

      });

      it("throws an error when there is a collision on calculated id (SHA1)", async () => {
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl",
        };

        const addedSourceEntity = await storeUnderTest.addSource(source);

        const article1: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity.id,
          externalId: "externalId",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        await storeUnderTest.addArticle(article1);

        const article2: Partial<ArticleEntity> = { ... article1 };

        try {
          await storeUnderTest.addArticle(article2);
          expect(true).toBe(false); // Should not reach this line
        }
        catch (error: any) {
          expect(error.message).toBe("Collision on calculated article id (SHA1)");
        }

      });

    });

    describe("getArticleById()", () => {

      it("gets an article by id", async () => {
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
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        const addedArticleEntity = await storeUnderTest.addArticle(article);
        const foundArticleEntity = await storeUnderTest.getArticleById(addedArticleEntity.id);
        expect(foundArticleEntity).toBeDefined();
        expect(foundArticleEntity).toBe(addedArticleEntity);
      });

      it("returns undefined when article does not exist", async () => {
        const foundArticleEntity = await storeUnderTest.getArticleById("A-123");
        expect(foundArticleEntity).toBeUndefined();
      });

    });

    describe("updateArticle()", () => {

      it("updates an article", async () => {
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
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        const addedArticleEntity = await storeUnderTest.addArticle(article);
        await storeUnderTest.updateArticle({
          ...addedArticleEntity,
          title: "updated title",
        });

        const foundArticleEntity = await storeUnderTest.getArticleById(addedArticleEntity.id);
        expect(foundArticleEntity).toBeDefined();
        expect(foundArticleEntity?.id).toBe(addedArticleEntity.id);
        expect(foundArticleEntity?.sourceId).toBe(addedSourceEntity.id);
        expect(foundArticleEntity?.externalId).toBe("externalId");
        expect(foundArticleEntity?.title).toBe("updated title");
        expect(foundArticleEntity?.date).toBe(article.date);
        expect(foundArticleEntity?.author).toBeUndefined();
        expect(foundArticleEntity?.link).toBeUndefined();
        expect(foundArticleEntity?.content).toBeUndefined();

      });

      it("throws an error when updating an article that does not exist", async () => {
        try {
          await storeUnderTest.updateArticle({
            id: "A-123",
            sourceId: "S-123",
            externalId: "externalId",
            title: "updated title",
            date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
          });
          expect(true).toBe(false); // Should not reach this line
        }
        catch (error: any) {
          expect(error.message).toBe("Article with id A-123 not found");
        }
      });

    });

    describe("deleteArticle()", () => {

      it("deletes an article", async () => {
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl",
        };

        const addedSourceEntity = await storeUnderTest.addSource(source);

        const article1: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity.id,
          externalId: "externalId1",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        const addedArticleEntity1 = await storeUnderTest.addArticle(article1);
        expect(await storeUnderTest.getAllArticlesCount()).toBe(1);

        const article2: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity.id,
          externalId: "externalId2",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        const addedArticleEntity2 = await storeUnderTest.addArticle(article2);
        expect(await storeUnderTest.getAllArticlesCount()).toBe(2);

        await storeUnderTest.deleteArticle(addedArticleEntity1.id);
        expect(await storeUnderTest.getAllArticlesCount()).toBe(1);

        await storeUnderTest.deleteArticle(addedArticleEntity2.id);
        expect(await storeUnderTest.getAllArticlesCount()).toBe(0);

      });

      it("throws an error when deleting an article that does not exist", async () => {
        try {
          await storeUnderTest.deleteArticle("A-123");
          expect(true).toBe(false); // Should not reach this line
        }
        catch (error: any) {
          expect(error.message).toBe("Article with id A-123 not found");
        }
      });

    });

    describe("getAllArticles()", () => {

      it("gets all articles", async () => {
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl",
        };

        const addedSourceEntity = await storeUnderTest.addSource(source);

        const article1: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity.id,
          externalId: "externalId1",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        const addedArticleEntity1 = await storeUnderTest.addArticle(article1);

        const article2: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity.id,
          externalId: "externalId2",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        const addedArticleEntity2 = await storeUnderTest.addArticle(article2);

        const allArticles = storeUnderTest.getAllArticles();
        expect(allArticles.length).toBe(2);
        expect(allArticles).toContain(addedArticleEntity1);
        expect(allArticles).toContain(addedArticleEntity2);

      });

      it("returns an empty array when there are no articles", async () => {
        const allArticles = storeUnderTest.getAllArticles();
        expect(allArticles.length).toBe(0);
      });

    });

    describe("getAllArticlesCount()", () => {

      it("returns the correct number of total articles", async () => {
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl",
        };

        const addedSourceEntity = await storeUnderTest.addSource(source);

        const article1: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity.id,
          externalId: "externalId1",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        await storeUnderTest.addArticle(article1);
        expect(await storeUnderTest.getAllArticlesCount()).toBe(1);

        const article2: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity.id,
          externalId: "externalId2",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        await storeUnderTest.addArticle(article2);
        expect(await storeUnderTest.getAllArticlesCount()).toBe(2);

      });

    });

    describe("deleteAllArticles()", () => {

      it("deletes all articles", async () => {
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl",
        };

        const addedSourceEntity = await storeUnderTest.addSource(source);

        const article1: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity.id,
          externalId: "externalId1",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        await storeUnderTest.addArticle(article1);
        expect(await storeUnderTest.getAllArticlesCount()).toBe(1);

        const article2: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity.id,
          externalId: "externalId2",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };

        await storeUnderTest.addArticle(article2);
        expect(await storeUnderTest.getAllArticlesCount()).toBe(2);

        const deleteCount = await storeUnderTest.deleteAllArticles();
        expect(await storeUnderTest.getAllArticlesCount()).toBe(0);
        expect(deleteCount).toBe(2);

      });

    });

    describe("getArticlesForSourceId()", () => {

      it("gets all articles for a source", async () => {
        const source1: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl1",
        };
        const addedSourceEntity1 = await storeUnderTest.addSource(source1);

        const source2: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl2",
        };
        const addedSourceEntity2 = await storeUnderTest.addSource(source2);

        const article1: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity1.id,
          externalId: "externalId1",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };
        const addedArticleEntity1 = await storeUnderTest.addArticle(article1);

        const article2: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity1.id,
          externalId: "externalId2",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };
        const addedArticleEntity2 = await storeUnderTest.addArticle(article2);

        const article3: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity2.id,
          externalId: "externalId3",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };
        const addedArticleEntity3 = await storeUnderTest.addArticle(article3);

        const articlesForSource1 = await storeUnderTest.getArticlesForSourceId(addedSourceEntity1.id);
        expect(articlesForSource1.length).toBe(2);
        expect(articlesForSource1).toContain(addedArticleEntity1);
        expect(articlesForSource1).toContain(addedArticleEntity2);

        const articlesForSource2 = await storeUnderTest.getArticlesForSourceId(addedSourceEntity2.id);
        expect(articlesForSource2.length).toBe(1);
        expect(articlesForSource2).toContain(addedArticleEntity3);

      });

      it("returns an empty array when there are no articles for a source", async () => {
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl",
        };
        const addedSourceEntity = await storeUnderTest.addSource(source);

        const articlesForSource = await storeUnderTest.getArticlesForSourceId(addedSourceEntity.id);
        expect(articlesForSource.length).toBe(0);
      });

      it("returns an empty array when the source does not exist", async () => {
        const articlesForSource = await storeUnderTest.getArticlesForSourceId("S-123");
        expect(articlesForSource.length).toBe(0);
      });

    });

    describe("getArticlesCountForSourceId()", () => {

      it("returns the correct number of articles for a source", async () => {
        const source1: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl1",
        };
        const addedSourceEntity1 = await storeUnderTest.addSource(source1);

        const source2: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl2",
        };
        const addedSourceEntity2 = await storeUnderTest.addSource(source2);

        const article1: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity1.id,
          externalId: "externalId1",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };
        await storeUnderTest.addArticle(article1);

        const article2: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity1.id,
          externalId: "externalId2",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };
        await storeUnderTest.addArticle(article2);

        const article3: Partial<ArticleEntity> = {
          sourceId: addedSourceEntity2.id,
          externalId: "externalId3",
          title: "title",
          date: DateUtils.randomDate(new Date("01/01/2024"), new Date()),
        };
        await storeUnderTest.addArticle(article3);

        expect(await storeUnderTest.getArticlesCountForSourceId(addedSourceEntity1.id)).toBe(2);
        expect(await storeUnderTest.getArticlesCountForSourceId(addedSourceEntity2.id)).toBe(1);

      });

      it("returns 0 when there are no articles for a source", async () => {
        const source: Partial<SourceEntity> = {
          title: "title",
          description: "description",
          feedUrl: "feedUrl",
        };
        const addedSourceEntity = await storeUnderTest.addSource(source);

        expect(await storeUnderTest.getArticlesCountForSourceId(addedSourceEntity.id)).toBe(0);
      });

      it("returns 0 when the source does not exist", async () => {
        expect(await storeUnderTest.getArticlesCountForSourceId("S-123")).toBe(0);
      });

    });

  });

});

