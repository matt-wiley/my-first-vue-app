import Freshness from "@/models/freshness";
import FeedParserService from "@/services/feedParserService";
import HashUtils, { HashAlgo } from "@/utils/hashUtils";
import SampleDataUtils from "@/utils/sampleDataUtils";
import TestUtils from "@/utils/testUtils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useInMemoryContentStore } from "../inMemoryContent";
import { useLocalStorageContentStore } from "../localStorageContent";
import { MockDataForUpdates } from "@/stores/__test__/data/contentTestData";
import type Article from "@/models/article";
import type ArticleRecord from "@/models/articleRecord";

/**
 * Test each of the content store implementations against the same suite to ensure
 * the behavior is consistent.
 */
[
  useLocalStorageContentStore, 
  useInMemoryContentStore
].forEach(targetContentStore => {

  describe(targetContentStore.$id, () => {

    it("adds a source", async () => {
  
      const piniaForTest = setActivePinia(createPinia());
      const feedUrlForTest = TestUtils.getFeedUrlForTest()
      const contentStore = targetContentStore(piniaForTest);
      const source = SampleDataUtils.generateSource();
      source.feedUrl = feedUrlForTest
      const sourceRecord = await contentStore.addSource(source);
  
      expect(sourceRecord.description).toEqual(source.description);
      expect(sourceRecord.feedUrl).toEqual(feedUrlForTest);
      expect(sourceRecord.title).toEqual(source.title);
      expect(sourceRecord.id).toEqual(`S-${await HashUtils.digest(HashAlgo.SHA1, feedUrlForTest)}`);
      expect(sourceRecord.url).toEqual(source.url);

      expect(contentStore.getAllSources).toContain(sourceRecord);
  
    });
  
    it("throws an error when adding a source with the same feed URL as an existing source", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const contentStore = targetContentStore(piniaForTest);
      const source = SampleDataUtils.generateSource();
      await contentStore.addSource(source);
      try {
        await contentStore.addSource(source);
        expect(true).toBe(false); // should not reach this line
      } catch (e: any) {
        expect(e.message).toEqual("Found existing source with the same feed URL");
      }
    });

    it("throws an error when adding a source with an empty feed URL", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const contentStore = targetContentStore(piniaForTest);
      const source = SampleDataUtils.generateSource();
      source.feedUrl = "";
      try {
        await contentStore.addSource(source);
        expect(true).toBe(false);
      } catch (e: any) {
        expect(e.message).toEqual("Feed URL is required");
      }
    });
  
    it("gets a source  by its id", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, sourceARecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
  
      expect(contentStore.getSource(sourceARecord.id)).toBe(sourceARecord);
      expect(contentStore.getSource("nonexistent")).toBe(undefined);
      expect(contentStore.getSource(undefined)).toBe(undefined);
    });
  
    it("deletes a source", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, sourceARecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
      contentStore.deleteSource(sourceARecord);
      expect(contentStore.getAllSources).not.toContain(sourceARecord);
      expect(contentStore.getArticlesForSourceId(sourceARecord.id)).toEqual([]);
    });
  
    it("deletes a source by id", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, sourceARecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
  
      contentStore.deleteSourceById(sourceARecord.id);
      expect(contentStore.getAllSources).not.toContain(sourceARecord);
      expect(contentStore.getArticlesForSourceId(sourceARecord.id)).toEqual([]);
    });
  
    it("adds an article", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const feedUrlForTest = TestUtils.getFeedUrlForTest()
      const contentStore = targetContentStore(piniaForTest);
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
  
      expect(contentStore.getArticlesForSourceId(sourceRecord.id)).toContain(articleRecord);
      expect(contentStore.getAllArticles).toContain(articleRecord);
    });
  
    it("throws an error when adding an article with the same calculated sha value", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const contentStore = targetContentStore(piniaForTest);
      const source = SampleDataUtils.generateSource();
      const sourceRecord = await contentStore.addSource(source);
      const article = SampleDataUtils.generateArticle();
      await contentStore.addArticle(sourceRecord, article);
      try {
        await contentStore.addArticle(sourceRecord, article);
        expect(true).toBe(false);
      } catch (e: any) {
        expect(e.message).toEqual("Found existing article with the same SHA");
      }
    });

    it("deletes articles by 'tombstoning' articles that are not Stale", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, articleARecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
      contentStore.deleteArticle(articleARecord);
      expect(contentStore.getArticle(articleARecord.id)).toBe(articleARecord);
      expect(articleARecord.isTombstoned).toBe(true);
    });
  
    it("deletes articles by removing articles that are Stale", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, articleARecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
      articleARecord.freshness = Freshness.Stale;
      contentStore.deleteArticle(articleARecord);
  
      expect(contentStore.getArticle(articleARecord.id)).toBe(undefined);
      expect(contentStore.getAllArticles).not.toContain(articleARecord);
    });
  
    it("deletes articles by id - 'tombstone', not Stale", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, articleARecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
      contentStore.deleteArticleById(articleARecord.id);
      expect(contentStore.getArticle(articleARecord.id)).toBe(articleARecord);
      expect(articleARecord.isTombstoned).toBe(true);
    });
  
    it("deletes articles by id - remove, Stale", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, articleARecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
      articleARecord.freshness = Freshness.Stale;
      contentStore.deleteArticleById(articleARecord.id);
  
      expect(contentStore.getArticle(articleARecord.id)).toBe(undefined);
      expect(contentStore.getAllArticles).not.toContain(articleARecord);
    });
  
    it("gets all sources", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, sourceARecord, sourceBRecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
  
      expect(contentStore.getAllSources.length).toEqual(2);
      expect(contentStore.getAllSources).toContain(sourceARecord);
      expect(contentStore.getAllSources).toContain(sourceBRecord);
    });
  
    it("gets all articles (all including tombstoned)", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, articleARecord, articleBRecord, articleCRecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
  
      expect(contentStore.getAllArticles.length).toEqual(3);
      expect(contentStore.getAllArticles).toContain(articleARecord);
      expect(contentStore.getAllArticles).toContain(articleBRecord);
      expect(contentStore.getAllArticles).toContain(articleCRecord);
    });
  
    it("gets articles (all not tombstoned)", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, articleARecord, articleBRecord, articleCRecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
  

      const articleRecords: ArticleRecord[] = contentStore.getArticles;

      expect(articleRecords.length).toEqual(2);
      expect(articleRecords).toContain(articleARecord);
      expect(articleRecords).toContain(articleCRecord);
      expect(articleRecords).not.toContain(articleBRecord);
    });
  
    it("gets articles for source", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, sourceARecord, sourceBRecord, articleARecord, articleCRecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
  
      expect(contentStore.getArticlesForSourceId(sourceARecord.id).length).toEqual(1);
      expect(contentStore.getArticlesForSourceId(sourceARecord.id)).toContain(articleARecord);
  
      expect(contentStore.getArticlesForSourceId(sourceBRecord.id).length).toEqual(1);
      expect(contentStore.getArticlesForSourceId(sourceBRecord.id)).toContain(articleCRecord);
  
      expect(contentStore.getArticlesForSourceId("nonexistent").length).toEqual(0);
  
    });
  
    it("gets an article by its id", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const { contentStore, articleARecord, articleBRecord, articleCRecord } = await TestUtils.setupContentStore({
        piniaForTest: piniaForTest,
        contentStoreLoader: targetContentStore
      });
  
      expect(contentStore.getArticle(articleARecord.id)).toBe(articleARecord);
      expect(contentStore.getArticle(articleBRecord.id)).toBe(articleBRecord);
      expect(contentStore.getArticle(articleCRecord.id)).toBe(articleCRecord);
      expect(contentStore.getArticle("nonexistent")).toBe(undefined);
      expect(contentStore.getArticle(undefined)).toBe(undefined);
    });
  
    it("updates a source", async () => {
      const piniaForTest = setActivePinia(createPinia());
      const contentStore = targetContentStore(piniaForTest);
      contentStore.clearAll();

      const sourceToUpdate = {
        "title": "GitHub Status - Incident History",
        "url": "https://www.githubstatus.com",
        "feedUrl": 'https://www.githubstatus.com/history.atom',
      }

      const articlesToUpdate = [
        {
          "externalId": "tag:www.githubstatus.com,2005:Incident/21156994",
          "title": "Incident with Copilot Pull Request Summaries",
          "date": new Date("2024-06-24T02:34:26.000Z"),
          "author": "GitHub",
          "link": "https://www.githubstatus.com/incidents/nzc328r69wrv",
          "content": "<p><small>Jun <var data-var='date'>19</var>, <var data-var='time'>12:53</var> UTC</small><br><strong>Resolved</strong> - Between June 18th, 2024 at 09:34 PM UTC and June 19th, 2024 at 12:53 PM the Copilot Pull Request Summaries Service was unavailable. This was due to an internal change in access approach from the Copilot Pull Request service to the Copilot API.<br /><br />We mitigated the incident by reverting the change in access which immediately resolved the errors.<br /><br />We are working to improve our monitoring in this area and reduce our time to detection to more quickly address issues like this one in the future.<br /></p><p><small>Jun <var data-var='date'>19</var>, <var data-var='time'>12:31</var> UTC</small><br><strong>Update</strong> - We are deploying a fix now and expect recovery within the hour.</p><p><small>Jun <var data-var='date'>19</var>, <var data-var='time'>11:59</var> UTC</small><br><strong>Update</strong> - We’ve identified an issue with Copilot pull request summaries that has caused errors when attempting to generate summaries since yesterday (June 18, 2024) at around 21:00 UTC. <br /><br />We have identified a fix, and we expect the issue to be resolved within two hours.</p><p><small>Jun <var data-var='date'>19</var>, <var data-var='time'>11:58</var> UTC</small><br><strong>Investigating</strong> - We are investigating reports of degraded performance for Copilot</p>"
        },
        {
          "externalId": "tag:www.githubstatus.com,2005:Incident/21148992",
          "title": "We are investigating degraded performance for GitHub Enterprise Importer migrations",
          "date": new Date("2024-06-21T19:43:13.000Z"),
          "author": "GitHub",
          "link": "https://www.githubstatus.com/incidents/k1mlxlmdhqqp",
          "content": "<p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>18:09</var> UTC</small><br><strong>Resolved</strong> - Starting on June 18th from 4:59pm UTC to 6:06pm UTC, customer migrations were unavailable and failing. This impacted all in-progress migration during that time. This issue was due to an incorrect configuration on our Database cluster. We mitigated the issue by remediating the database configuration and are working with stakeholders to ensure safeguards are in place to prevent the issue going forward.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>18:04</var> UTC</small><br><strong>Update</strong> - We have applied a configuration change to our migration service as a mitigation and are beginning to see recovery and in increase in successful migration runs. We are continuing to monitor.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>17:48</var> UTC</small><br><strong>Update</strong> - We have identified what we believe to be the source of the migration errors and are applying a mitigation, which we expect will begin improving migration success rate.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>17:15</var> UTC</small><br><strong>Update</strong> - We are investigating degraded performance for GitHub Enterprise Importer migrations. Some customers may see an increase in failed migrations. Investigation is ongoing.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>17:14</var> UTC</small><br><strong>Investigating</strong> - We are currently investigating this issue.</p>"
        },
        {
          "externalId": "tag:www.githubstatus.com,2005:Incident/21078205",
          "title": "Incident with Actions",
          "date": new Date("2024-06-14T05:48:37.000Z"),
          "author": "GitHub",
          "link": "https://www.githubstatus.com/incidents/lfrlwdg67fn8",
          "content": "<p><small>Jun <var data-var='date'>11</var>, <var data-var='time'>21:39</var> UTC</small><br><strong>Resolved</strong> - On June 11th, 2024 between 20:13 UTC and 21:39 UTC, the GitHub Actions service was degraded. A security-related change applied by one of our third-party providers prevented new customers from onboarding to GitHub Actions and caused an average 28% of Actions jobs to fail.<br /><br />We mitigated the incident by working with the third-party provider to revert the change and are working with their engineering team to fully understand the root cause. Additionally, we are improving communication between GitHub and our service providers to reduce the time needed to resolve similar issues in the future.</p><p><small>Jun <var data-var='date'>11</var>, <var data-var='time'>21:35</var> UTC</small><br><strong>Update</strong> - We've applied a mitigation to unblock running Actions and are seeing an improvement in our service availability.</p><p><small>Jun <var data-var='date'>11</var>, <var data-var='time'>21:16</var> UTC</small><br><strong>Update</strong> - Customers may see issues running Actions, we are in the process of applying a mitigation to restore our service.</p><p><small>Jun <var data-var='date'>11</var>, <var data-var='time'>20:34</var> UTC</small><br><strong>Update</strong> - Customers may see issues running Actions</p><p><small>Jun <var data-var='date'>11</var>, <var data-var='time'>20:33</var> UTC</small><br><strong>Investigating</strong> - We are investigating reports of degraded performance for Actions and API Requests</p>"
        }
      ]

      const initialData = {
        source: sourceToUpdate,
        articles: [
          articlesToUpdate[1],
          articlesToUpdate[2],
        ]
      }

      const latestUpdate = {
        source: sourceToUpdate,
        articles: [
          articlesToUpdate[0],
          articlesToUpdate[1],
        ]
      }

      const sourceRecord = await contentStore.addSource(initialData.source);
      // expect(contentStore.getAllSources).toContain(sourceRecord);
      // expect(contentStore.getArticlesForSourceId(sourceRecord.id)).toHaveLength(0);
      // expect(contentStore.getSource(sourceRecord.id)).toBe(sourceRecord);

      for (const article of initialData.articles) {
        await contentStore.addArticle(sourceRecord, article);
      }

      let articlesForSource: ArticleRecord[] = contentStore.getArticlesForSourceId(sourceRecord.id);
      expect(contentStore.getArticlesForSourceId(sourceRecord.id)).toHaveLength(2);

      // expect(articlesForSource[0].sourceId).toBe(sourceRecord.id);
      expect(articlesForSource[0].freshness).toBe(Freshness.New);
      // expect(articlesForSource[1].sourceId).toBe(sourceRecord.id);
      expect(articlesForSource[1].freshness).toBe(Freshness.New);

      await contentStore.refreshFeed(latestUpdate);
      
      articlesForSource = contentStore.getArticlesForSourceId(sourceRecord.id);
      expect(articlesForSource).toHaveLength(3);

      const newArticle = articlesForSource.find(a => a.externalId === articlesToUpdate[0].externalId);
      expect(newArticle).toBeDefined()
      // expect(newArticle?.sourceId).toBe(sourceRecord.id);
      expect(newArticle!.freshness).toBe(Freshness.New);

      const currentArticle = articlesForSource.find(a => a.externalId === articlesToUpdate[1].externalId);
      expect(currentArticle).toBeDefined()
      // expect(currentArticle?.sourceId).toBe(sourceRecord.id);
      expect(currentArticle!.freshness).toBe(Freshness.Current);

      const staleArticle = articlesForSource.find(a => a.externalId === articlesToUpdate[2].externalId);
      expect(staleArticle).toBeDefined()
      // expect(staleArticle?.sourceId).toBe(Freshness.Stale);
      expect(staleArticle!.freshness).toBe(Freshness.Stale);

      
  
    });

  });

});