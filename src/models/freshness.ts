export enum Freshness {
    // New articles are in the feed update and were added to the datastore during this update
    New = "New",
    // Current articles are in the feed update and were already in the datastore
    Current = "Current",
    // Stale articles are not in the feed update and were already in the datastore
    Stale = "Stale"
}
