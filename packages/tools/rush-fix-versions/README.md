<!-- genericHeader start -->

# @kadena-dev/rush-fix-versions

Tool to assist with making consistent versions across rush monorepo

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

Package allows to align versions to align with `ensureConsistentVersions=true`
option in rush.json

## Integrate with rush

To use this as a command (e.g. `rush fix-versions`) you can add this as a
autoinstalled package and add `fix-versions` command to the `command-line.json`.

For reference see [maintaining autoinstallers][1]

1.  initialize the autoinstaller
    ```sh
    rush init-autoinstaller --name rush-fix-versions
    ```
2.  add `@kadena-dev/rush-fix-versions` to the
    `autoinstallers/rush-fix-versions/package.json`
3.  update the lockfile for the autoinstaller
    ```sh
    cd common/autoinstallers/rush-fix-versions
    rush update-autoinstaller --name rush-fix-versions
    ```
4.  add the `fix-versions` command to `command-line.json`
    ```json
    {
      "commandKind": "global",
      "name": "fix-versions",
      "summary": "Runs fix-versions to get consistent versions across projects",
      "safeForSimultaneousRushProcesses": false,
      "autoinstallerName": "rush-fix-versions",
      // This will invoke ./common/autoinstallers/rush-fix-versions/node_modules/.bin/rush-fix-versions
      "shellCommand": "rush-fix-versions"
    },
    ```
5.  Now execute `rush fix-versions` and it'll present you the versions that are
    misaligned

[1]: https://rushjs.io/pages/maintainer/autoinstallers/
