---
'@kadena-dev/scripts': minor
---

Adds a script to validate whether changed files are exclusively of a specific
set

- **`check-changed-files.sh`** in `packages/tools/scripts/`:
  - A script to validate that changes in a pull request are restricted to
    specific documentation and asset files.
  - The script checks the modified files against a predefined list of allowed
    paths and file types and exits with an error if any disallowed files are
    detected.

**Purpose:**  
To support automated approval of pull requests that only modify approved
documentation or asset files, enhancing the CI/CD workflow efficiency.
