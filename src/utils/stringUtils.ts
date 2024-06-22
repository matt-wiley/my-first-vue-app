import { LOREM_IPSUM, SHUFFLE_LOREM_IPSUM } from "./loremIpsum";

/**
 * Utility class for string operations.
 */
export class StringUtils {

    /**
     * Determines if a string is empty.
     *
     * @param str The string to check.
     * @returns True if the string is empty, false otherwise.
     */
    static isEmpty(str: string | null | undefined): boolean {
        return str === null || str === undefined || str === "";
    }

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

    /**
     * Generates a random range of lorem ipsum text.
     *
     * @param length The length of the string to generate.
     * @returns A random range of lorem ipsum text.
     */
    static randomWordsOfloremIpsum(length: number): string {
        const maxStartIndex = SHUFFLE_LOREM_IPSUM.length - length;
        const startIndex = Math.floor(Math.random() * maxStartIndex);
        return SHUFFLE_LOREM_IPSUM.slice(startIndex, startIndex + length).join(" ");
    }

    /**
     * Capitalizes the first letter of a string.
     *
     * @param str The string to capitalize.
     * @returns The string with the first letter capitalized.
     */
    static capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

}

export default StringUtils;