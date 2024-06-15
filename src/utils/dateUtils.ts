

/**
 * A utility class for date operations
 */
export class DateUtils {

    /**
     * Given a start and end date, return a random date between them
     * 
     * @param start The start date
     * @param end The end date
     * @param startHour The start hour (default 0)
     * @param endHour The end hour (default 24)
     * @returns The random date
     * 
     * ref: https://stackoverflow.com/a/31379050
     */
    static randomDate(start: Date, end: Date, startHour = 0, endHour = 24) {
        const dateDifference = end.getTime() - start.getTime();
        var date = new Date(start.getTime() + Math.random() * dateDifference);
        var hour = startHour + Math.random() * (endHour - startHour) | 0;
        date.setHours(hour);
        return date;
    }

    /**
     * Given a date, return a string in the format "MMMM DD, YYYY HH:MM AM/PM"
     * 
     * @param date The date to format
     * 
     * @returns The formatted date
     */
    static presentDateAsMMMM_DD_YYYY_HH_MM_AMPM(date: Date) {
        return date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    }

}
export default DateUtils;