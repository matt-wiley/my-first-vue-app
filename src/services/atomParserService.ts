import type { OptionalString, Optional } from "../utils/optionalTypeUtils"; 
import type { ParsedFeed } from "./feedParserService";

interface Person {
    name: OptionalString;
    email: OptionalString;
    uri: OptionalString;
}

interface AtomSource {
    id: OptionalString;
    title: OptionalString;
    updated: Date;
    links?: OptionalString[];
    description?: OptionalString;
    authors?: Optional<Person>[];
}

interface AtomArticle {
    id: OptionalString;
    title: OptionalString;
    updated: Date;
    authors?: Optional<Person>[];
    content?: OptionalString;
    links?: OptionalString[];
    summary?: OptionalString;
    // source?: Element;
}


export interface ParsedAtomFeed {
    source: AtomSource;
    articles: AtomArticle[];
}

export default class AtomParserService {

    private static readonly SOURCE_TAG = "feed";

    // Required fields for "feed" from Atom Specification
    private static readonly SOURCE_ID = "id";
    private static readonly SOURCE_TITLE_TAG = "title";
    private static readonly SOURCE_UPDATED_TAG = "updated";

    // Optional fields for "feed" from Atom Specification
    private static readonly SOURCE_SITE_URL_TAG = "link";
    private static readonly SOURCE_DESCRIPTION_TAG = "subtitle";


    private static readonly ARTICLE_TAG = "entry";

    // Required fields for "entry" from Atom Specification
    private static readonly ARTICLE_ID_TAG = "id";
    private static readonly ARTICLE_TITLE_TAG = "title";
    private static readonly ARTICLE_UPDATED_TAG = "updated";

    // Optional fields for "entry" from Atom Specification
    private static readonly ARTICLE_LINK_TAG = "link";
    private static readonly ARTICLE_CONTENT_TAG = "content";
    private static readonly ARTICLE_SUMMARY_TAG = "summary";
    private static readonly ARTICLE_SOURCE_TAG = "source";

    private static readonly AUTHOR_TAG = "author";
    private static readonly CONTRIBUTOR_TAG = "contributor";
    private static readonly PERSON_NAME_TAG = "name";
    private static readonly PERSON_EMAIL_TAG = "email";
    private static readonly PERSON_URI_TAG = "uri";


    /**
     * Parses an Atom feed into a ParsedFeed object.
     * 
     * @param feed The Atom feed DOM Document to parse
     * @returns The parsed feed object
     * 
     */
    public static parseFeed(feed: Document): ParsedAtomFeed {
        const atomSource: AtomSource = AtomParserService.parseAtomSourceFromFeed(feed);
        const atomArticles: AtomArticle[] = AtomParserService.parseArticlesFromFeed(feed);
        return { source: atomSource, articles: atomArticles };
    }


    public static parseAndTransformFeed(feed: Document): ParsedFeed {
        const parsedAtomFeed = AtomParserService.parseFeed(feed);
        return AtomParserService.transformAsGeneralParsedFeed(parsedAtomFeed);
    }

    private static transformAsGeneralParsedFeed(atomFeed: ParsedAtomFeed): ParsedFeed {
        const source = {
            title: atomFeed.source.title,
            url: atomFeed.source.links?.[0],
            description: atomFeed.source.description,
        };
        const articles = atomFeed.articles.map(article => {
            return {
                externalId: article.id,
                title: article.title,
                date: article.updated,
                author: AtomParserService.generalizeAuthor(atomFeed.source.authors, article.authors),
                link: article.links?.[0],
                content: article.content,
            }
        });
        return { source, articles };
    }

    private static generalizeAuthor(sourceAuthors: Optional<Person>[] | undefined, articleAuthors: Optional<Person>[] | undefined): OptionalString {
        let author: OptionalString = undefined;

        const buildAuthorLink = (person: Optional<Person>) => {
            let link: string | undefined = "";
            if (person?.uri) {
                link = `<a href="${person.uri}">${person.name}</a>`;
            }
            else {
                link = person!.name || undefined;
            }
            return link;
        }

        if (articleAuthors && articleAuthors.length > 0) {
            author = buildAuthorLink(articleAuthors[0]) ;
        }
        else if (sourceAuthors && sourceAuthors.length > 0) {
            author = buildAuthorLink(sourceAuthors[0]);
        }
        return author;
    }


/* ================================================================================================

 ____ __  __ ______ ____  _  _    ____   ___  ____   __  __ __  __   ___ 
||    ||\ || | || | || \\ \\//    || \\ // \\ || \\ (( \ || ||\ ||  // \\
||==  ||\\||   ||   ||_//  )/     ||_// ||=|| ||_//  \\  || ||\\|| (( ___
||___ || \||   ||   || \\ //      ||    || || || \\ \_)) || || \||  \\_||


=============================================================================================== */

    /**
     * Parses the articles from an Atom feed.
     * 
     * @param feed The Atom feed DOM Document to parse
     * @returns An array of AtomArticle objects
     * 
     */
    private static parseArticlesFromFeed(feed: Document): AtomArticle[] {
        const articles: AtomArticle[] = [];
        const entryTags = feed.querySelectorAll(AtomParserService.ARTICLE_TAG);
        for (let i = 0; i < entryTags.length; i++) {
            const entry = entryTags[i];
            articles.push(AtomParserService.parseAtomArticleFromEntry(entry));
        }
        return articles;
    }

    /**
     * Parses an Atom feed into an AtomArticle object.
     * 
     * @param article The Atom article DOM Element to parse
     * @returns The parsed AtomArticle object
     * 
     */
    private static parseAtomArticleFromEntry(entry: Element): AtomArticle {
        const cls = AtomParserService; // Static class alias
        return {
            id: cls.parseIdFromEntry(entry),
            title: cls.parseTitleFromEntry(entry),
            updated: cls.parseUpdatedFromEntry(entry),
            authors: cls.parseAuthorFromEntry(entry),
            content: cls.parseContentFromEntry(entry),
            links: cls.parseLinksFromEntry(entry),
            summary: cls.parseSummaryFromEntry(entry),
        }
    }


    /**
     * Parses the ID field of an Atom entry.
     * 
     * @param article The Atom entry DOM Element to parse
     * @returns An optional string representing the ID of the entry
     * 
     * @throws An error if the ID field is not found
     * 
     */
    private static parseIdFromEntry(entry: Element): OptionalString {
        const idTag = entry.querySelectorAll(`${AtomParserService.ARTICLE_ID_TAG}`);
        if (idTag.length > 0) {
            return AtomParserService.parseTextConstruct(idTag[0]);
        }
        else {
            throw new Error("Entry ID not found");
        }
    }

    /**
     * Parses the title field of an Atom entry.
     * 
     * @param article The Atom entry DOM Element to parse
     * @returns An optional string representing the title of the entry
     * 
     * @throws An error if the title field is not found
     * 
     */
    private static parseTitleFromEntry(entry: Element): OptionalString {
        const titleTag = entry.querySelectorAll(`${AtomParserService.ARTICLE_TITLE_TAG}`);
        if (titleTag.length > 0) {
            return AtomParserService.parseTextConstruct(titleTag[0]);
        }
        else {
            throw new Error("Entry title not found");
        }
    }


    /**
     * Parses the updated field of an Atom entry.
     * 
     * @param article The Atom entry DOM Element to parse
     * @returns An optional Date object representing the updated date of the entry
     * 
     * @throws An error if the updated field is not found
     */
    private static parseUpdatedFromEntry(entry: Element): Date {
        const updatedTag = entry.querySelectorAll(`${AtomParserService.ARTICLE_UPDATED_TAG}`);
        if (updatedTag.length > 0) {
            const updated = AtomParserService.parseTextConstruct(updatedTag[0]);
            if (!updated) {
                throw new Error("Entry updated date not found");
            }
            return new Date(updated);
        }
        else {
            throw new Error("Entry updated date not found");
        }
    }

    /**
     * Parses the author and or contributor fields of an Atom entry.
     * 
     * @param article The Atom entry DOM Element to parse
     * @returns An array of optional Person objects representing the authors of the entry
     */
    private static parseAuthorFromEntry(entry: Element): Optional<Person>[] | undefined {
        let authors: Optional<Person>[] = [];

        const authorTags = entry.querySelectorAll(`${AtomParserService.AUTHOR_TAG}`)
        if (authorTags.length > 0) {
            authors = authors.concat(Array.from(authorTags).map((authorTag) => AtomParserService.parsePersonConstruct(authorTag)));
        }

        const contributorTags = entry.querySelectorAll(`${AtomParserService.CONTRIBUTOR_TAG}`)
        if (contributorTags.length > 0) {
            authors = authors.concat(Array.from(contributorTags).map((contributorTag) => AtomParserService.parsePersonConstruct(contributorTag)));
        }

        if (authors.length > 0) {
            return authors;
        }
        return undefined;
    }

    /**
     * Parses the content field of an Atom entry.
     * 
     * @param article The Atom entry DOM Element to parse
     * @returns An optional string representing the content of the entry
     */
    private static parseContentFromEntry(entry: Element): OptionalString {
        const contentTag = entry.querySelectorAll(`${AtomParserService.ARTICLE_CONTENT_TAG}`);
        if (contentTag.length > 0) {
            return AtomParserService.parseTextConstruct(contentTag[0]);
        }
        return undefined;
    }

    /**
     * Parses the summary field of an Atom entry.
     * 
     * @param article The Atom entry DOM Element to parse
     * @returns An optional string representing the summary of the entry
     */
    private static parseSummaryFromEntry(entry: Element): OptionalString {
        const summaryTag = entry.querySelectorAll(`${AtomParserService.ARTICLE_SUMMARY_TAG}`);
        if (summaryTag.length > 0) {
            return AtomParserService.parseTextConstruct(summaryTag[0]);
        }
        return undefined;
    }

    /**
     * Parses the link fields of an Atom entry.
     * 
     * @param article The Atom entry DOM Element to parse
     * @returns An array of strings representing the link of the entry
     */
    private static parseLinksFromEntry(entry: Element): OptionalString[] | undefined {
        const linkTags = entry.querySelectorAll(`${AtomParserService.ARTICLE_LINK_TAG}`);
        if (linkTags.length > 0) {
            return Array.from(linkTags).map((link) => AtomParserService.parseLinkConstruct(link));
        }
        return undefined;
    }


/* ================================================================================================

 ____  ____  ____ ____      ____   ___  ____   __  __ __  __   ___ 
||    ||    ||    || \\     || \\ // \\ || \\ (( \ || ||\ ||  // \\
||==  ||==  ||==  ||  ))    ||_// ||=|| ||_//  \\  || ||\\|| (( ___
||    ||___ ||___ ||_//     ||    || || || \\ \_)) || || \||  \\_||


=============================================================================================== */
// Parsers for the required and optional fields of an Atom <feed> tag.


    /**
     * Parses an Atom feed into an AtomSource object.
     * 
     * @param feed The Atom feed DOM Document to parse
     * @returns The parsed AtomSource object
     * @throws An error if the required fields are not found (id, title, updated)
     * 
     */
    private static parseAtomSourceFromFeed(feed: Document): AtomSource {
        const cls = AtomParserService; // Static class alias
        return {
            id: cls.parseIdFromFeed(feed),
            title: cls.parseTitleFromFeed(feed),
            updated: cls.parseUpdatedFromFeed(feed),
            links: cls.parseLinksFromFeed(feed),
            description: cls.parseDescriptionFromFeed(feed),
            authors: cls.parseAuthorFromFeed(feed),
        }
    }

    /**
     * Parses the ID field of an Atom feed.
     * 
     * @param feed The Atom feed DOM Document to parse
     * @returns An optional string representing the ID of the feed
     * @throws An error if the ID field is not found
     * 
     */
    private static parseIdFromFeed(feed: Document): OptionalString {
        const idTag = feed.querySelectorAll(`${AtomParserService.SOURCE_TAG} > ${AtomParserService.SOURCE_ID}`);
        if (idTag.length > 0) {
            return AtomParserService.parseTextConstruct(idTag[0]);
        }
        else {
            throw new Error("Feed ID not found");
        }
    }

    /**
     * Parses the title field of an Atom feed.
     * 
     * @param feed The Atom feed DOM Document to parse
     * @returns An optional string representing the title of the feed
     * @throws An error if the title field is not found
     * 
     */
    private static parseTitleFromFeed(feed: Document): OptionalString {
        const titleTag = feed.querySelectorAll(`${AtomParserService.SOURCE_TAG} > ${AtomParserService.SOURCE_TITLE_TAG}`);
        if (titleTag.length > 0) {
            return AtomParserService.parseTextConstruct(titleTag[0]);
        }
        else {
            throw new Error("Feed title not found");
        }
    }

    /**
     * Parses the updated field of an Atom feed.
     * 
     * @param feed The Atom feed DOM Document to parse
     * @returns An optional Date object representing the updated date of the feed
     * @throws An error if the updated field is not found
     * 
     */
    private static parseUpdatedFromFeed(feed: Document): Date {
        const updatedTag = feed.querySelectorAll(`${AtomParserService.SOURCE_TAG} > ${AtomParserService.SOURCE_UPDATED_TAG}`);
        if (updatedTag.length > 0) {
            const updated = AtomParserService.parseTextConstruct(updatedTag[0]);
            if (!updated) {
                throw new Error("Feed updated date not found");
            }
            return new Date(updated);
        }
        else {
            throw new Error("Feed updated date not found");
        }
    }

    /**
     * Parses the link field of an Atom feed.
     * 
     * @param feed The Atom feed DOM Document to parse
     * @returns An optional string representing the link of the feed
     * 
     */
    private static parseLinksFromFeed(feed: Document): OptionalString[] | undefined {
        const linkTags = feed.querySelectorAll(`${AtomParserService.SOURCE_TAG} > ${AtomParserService.SOURCE_SITE_URL_TAG}`);
        if (linkTags.length > 0) {
            return Array.from(linkTags).map((link) => AtomParserService.parseLinkConstruct(link));
        }
    }

    /**
     * Parses the description field of an Atom feed.
     * 
     * @param feed The Atom feed DOM Document to parse
     * @returns An optional string representing the description of the feed
     * 
     */
    private static parseDescriptionFromFeed(feed: Document): OptionalString {
        const descriptionTag = feed.querySelectorAll(`${AtomParserService.SOURCE_TAG} > ${AtomParserService.SOURCE_DESCRIPTION_TAG}`);
        if (descriptionTag.length > 0) {
            return AtomParserService.parseTextConstruct(descriptionTag[0]);
        }
        return undefined;
    }

    /**
     * Parses the author and or contributor fields of an Atom feed.
     * 
     * @param feed The Atom feed DOM Document to parse
     * @returns An array of optional Person objects representing the authors of the feed
     * 
     */
    private static parseAuthorFromFeed(feed: Document): Optional<Person>[] | undefined {
        let authors: Optional<Person>[] = [];

        const authorTags = feed.querySelectorAll(`${AtomParserService.SOURCE_TAG} > ${AtomParserService.AUTHOR_TAG}`)
        if (authorTags.length > 0) {

            authors = authors.concat(Array.from(authorTags).map((authorTag) => AtomParserService.parsePersonConstruct(authorTag)));
        }

        const contributorTags = feed.querySelectorAll(`${AtomParserService.SOURCE_TAG} > ${AtomParserService.CONTRIBUTOR_TAG}`)
        if (contributorTags.length > 0) {
            authors = authors.concat(Array.from(contributorTags).map((contributorTag) => AtomParserService.parsePersonConstruct(contributorTag)));
        }

        if (authors.length > 0) {
            return authors;
        }
        return undefined;
    }





/* ================================================================================================

  ___   ___   __  __  __  ______ ____  __ __   ___ ______
 //    // \\  ||\ || (( \ | || | || \\ || ||  //   | || |
((    ((   )) ||\\||  \\    ||   ||_// || || ((      ||  
 \\__  \\_//  || \|| \_))   ||   || \\ \\_//  \\__   ||  
                                                         
____   ___  ____   __  __ __  __   ___                   
|| \\ // \\ || \\ (( \ || ||\ ||  // \\                  
||_// ||=|| ||_//  \\  || ||\\|| (( ___                  
||    || || || \\ \_)) || || \||  \\_||                  


=============================================================================================== */
// Naive parsers for basic constructs of an Atom feed.


    /**
     * Naive parser for the title, summary, content, and rights fields of an Atom feed.
     * 
     * @param element The element to parse
     * 
     * @returns A string representing the content of the element
     * 
     * ref: https://validator.w3.org/feed/docs/atom.html#text
     *  
     */
    private static parseTextConstruct(element: Element | null): OptionalString {
        if (!element) {
            return undefined;
        }
        let text = element.textContent || undefined;
        return text;
    }

    /**
     * Naive parser for the author and contributor fields of an Atom feed.
     * 
     * @param element The element to parse
     * 
     * @returns A string representing the content of the element
     * 
     * ref: https://validator.w3.org/feed/docs/atom.html#person
     */
    private static parsePersonConstruct(element: Element | null): Optional<Person> {
        if (!element) {
            return undefined;
        }
        const cls = AtomParserService; // Static class alias
        let name = element.getElementsByTagName(cls.PERSON_NAME_TAG)[0]?.textContent || "";
        let email = element.getElementsByTagName(cls.PERSON_EMAIL_TAG)[0]?.textContent || "";
        let uri = element.getElementsByTagName(cls.PERSON_URI_TAG)[0]?.textContent || "";
        return { name, email, uri }
    }

    /**
     * Naive parser for a link field of an Atom feed.
     * 
     * @param element The element to parse
     * 
     * @returns A string representing the content of the element
     * 
     * ref: https://validator.w3.org/feed/docs/atom.html#link
     */
    private static parseLinkConstruct(element: Element | null): OptionalString {
        if (!element) {
            return undefined;
        }
        let link = element.getAttribute("href") || undefined;
        return link;
    }

}