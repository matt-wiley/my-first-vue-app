/**
 * @description Enum for the freshness of an article
 */
enum Freshness {
    New = "New",            // New articles are in the feed update and were added to the datastore during this update
    Current = "Current",    // Current articles are in the feed update and were already in the datastore
    Stale = "Stale"         // Stale articles are not in the feed update and were already in the datastore
}
export default Freshness;
