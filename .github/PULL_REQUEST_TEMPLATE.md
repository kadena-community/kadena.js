### Modify this title

Related Issue/Asana ticket: \_

Short description: \_

<!--
Examples:

Title: Add Search Functionality to User Dashboard.
Related Issue: #1234
Short Description:
Implements a new search bar in the user dashboard to allow quick navigation and filtering of project lists based on user input. This feature enhances user experience by providing a more efficient way to locate specific projects.

Title: Fix Memory Leak in Data Processing Module.
Asana ticket: https://app.asana.com/0/1205801361945248/1207389790540430
Short Description:
Resolves a critical memory leak occurring in the data processing module when handling large datasets. This fix improves system stability and performance under heavy load conditions.
-->

### Test scenarios

- description of the (manually) executed test scenarios

<!--
Examples:

Add Search Functionality to User Dashboard
* Search Function Test: Verifies that entering a keyword in the search bar returns a list of projects containing that keyword.
* Empty Result Test: Confirms that a message is displayed when no projects match the search criteria.
* Performance Test: Ensures that the search functionality returns results within 2 seconds under typical load conditions.

Fix Memory Leak in Data Processing Module
* Memory Usage Test: Monitors memory usage during data processing to ensure that no unexpected memory growth occurs.
* Regression Test: Confirms that the data processing outputs remain consistent with previous versions post-fix.
* Stress Test: Executes the data processing module under high load to validate stability improvements.
-->

### Reminders (if applicable)

- [ ] I ran `pnpm install` and `pnpm test` in the root of the monorepo
      (optionally with `--filter=...package...` to exclude non-affected
      projects)
- [ ] I ran `pnpm changeset` in the root of the monorepo
- [ ] Test coverage has not decreased
- [ ] Docs have been updated to reflect changes in PR (don't forget
      docs.kadena.io)
