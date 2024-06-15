export enum HashAlgo {
    SHA256 = "SHA-256",
    SHA384 = "SHA-384",
    SHA512 = "SHA-512",
    SHA1 = "SHA-1"
}

/**
 * A utility class for hashing functions
 */
export class HashUtils {

    /**
     * Given a string and a hash algorithm, return the hash of the string
     *
     * @param algorith The hash algorithm to use
     * @param text The text to hash
     * @returns The hash of the text
     *
     * ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API/Non-cryptographic_uses_of_subtle_crypto
     *
     */
    static async digest(algorith: HashAlgo, text: string): Promise<string> {
        // encode as UTF-8
        const msgBuffer = new TextEncoder().encode(text);

        // hash the message to an ArrayBuffer
        const hashBuffer = await crypto.subtle.digest(algorith, msgBuffer);

        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // convert bytes in the Array to hex string
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        return hashHex;
    }
}
export default HashUtils;
