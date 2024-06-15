import { LOREM_IPSUM, SHUFFLE_LOREM_IPSUM } from "./loremIpsum";

/**
 * Utility class for string operations.
 */
export class StringUtils {

    /**
     * Generates a random string of the specified length.
     *
     * @param length The length of the string to generate.
     * @returns A random string of the specified length.
     */
    static randomStringOfLength(length: number): string {
        const chars =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let i = length; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    /**
     * Generates a string of lorem ipsum text.
     *
     * @param numberOfWords The number of words to generate.
     * @returns A string of lorem ipsum text.
     */
    static wordsOfloremIpsum(numberOfWords: number): string {
        return LOREM_IPSUM.slice(0, numberOfWords).join(" ");
    }

    static randomWordsOfloremIpsum(length: number): string {
        const maxStartIndex = SHUFFLE_LOREM_IPSUM.length - length;
        const startIndex = Math.floor(Math.random() * maxStartIndex);
        return SHUFFLE_LOREM_IPSUM.slice(startIndex, startIndex + length).join(" ");
    }

}

export default StringUtils;