import HashUtils, { HashAlgo } from "@/utils/hashUtils";
import SampleDataUtils from "@/utils/sampleDataUtils";
import TestUtils from "@/utils/testUtils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useLocalStorageContentStore } from "../localStorageContent";


describe("localStorageContent", () => {

  it("adds a source", async () => {

    const piniaForTest = setActivePinia(createPinia());
    const feedUrlForTest = TestUtils.getFeedUrlForTest()
    const contentStore = useLocalStorageContentStore(piniaForTest);
    const source = SampleDataUtils.generateSource();
    source.feedUrl = feedUrlForTest
    const sourceRecord = await contentStore.addSource(source);

    expect(sourceRecord.description).toEqual(source.description);
    expect(sourceRecord.feedUrl).toEqual(feedUrlForTest);
    expect(sourceRecord.title).toEqual(source.title);
    expect(sourceRecord.id).toEqual(`S-${await HashUtils.digest(HashAlgo.SHA1, feedUrlForTest)}`);
    expect(sourceRecord.url).toEqual(source.url);

    expect(Object.values(contentStore.entities)).toContain(sourceRecord);

  });

});