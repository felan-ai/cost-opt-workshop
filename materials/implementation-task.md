# Implementation Task

Add product search to the Storzy inventory.

Customers should be able to search products by name or description and see updated results while they type. Search should go through the catalog API rather than filtering only the products already loaded in the browser.

The current search should be reflected in the URL so the page can be bookmarked or shared. Include a useful no-results state and a convenient way to return to the complete catalog.

Make the interaction responsive without sending unnecessary requests, and ensure rapid typing cannot display results from an older search. Existing sorting, cart behavior, loading, retry, and error handling should continue working.

Follow the repository's existing API validation, operational logging, privacy, testing, and UI conventions. Keep the change focused and avoid introducing dependencies unless genuinely necessary.

Implement the feature end-to-end and verify it using the repository's existing checks.
