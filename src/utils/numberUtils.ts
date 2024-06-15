
/**
 * Utility class for number operations
 */
export class NumberUtils {

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * 
     * @param min The minimum value
     * @param max The maximum value
     * @returns The random integer
     */
    static randomIntInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
export default NumberUtils;