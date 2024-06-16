/**
 * A utility class for validation.
 */
export class ValidationUtils {

    
    /**
     * Determines if a URL is valid.
     * 
     * @param url The URL to validate.
     * @returns True if the URL is valid, false otherwise.
     */
    static isValidUrl(url: string | null): boolean {
        if (url === null) return false;
        if (url === "") return false;
        if ( ! (url.startsWith("http://") || url.startsWith("https://")) ) return false;
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

}