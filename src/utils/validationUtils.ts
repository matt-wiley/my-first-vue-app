/**
 * A utility class for validation.
 */
export default class ValidationUtils {


  /**
   * Determines if a URL is valid.
   * 
   * @param url The URL to validate.
   * @returns True if the URL is valid, false otherwise.
   */
  static isValidUrl(url: string | null | undefined): boolean {
    if (url === undefined) return false;
    if (url === null) return false;
    if (url === "") return false;
    if (!(url!.startsWith("http://") || url!.startsWith("https://"))) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Determines if a string is empty.
   * 
   * @param value The string to validate.
   * @returns True if the string is empty, false otherwise.
   */
  static isEmptyString(value: string | null | undefined): boolean {
    if (value === undefined) return true;
    if (value === null) return true;
    if (value === "") return true;
    return false
  }

}