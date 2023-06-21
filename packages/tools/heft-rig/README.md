## @kadena-dev/heft-rig

A rig package for Node.js projects that build using [Heft][1] build system. To
learn more about rig packages, consult the [@rushstack/rig-package][2]
documentation.

This rig contains a single profile: `default`

To enable it, add a **rig.json** file to your project, as shown below:

**config/rig.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",

  "rigPackageName": "@kadena-dev/heft-rig"
}
```

The config files provided by this rig profile can be found in the
[heft-node-rig/profiles/default][3] source folder.

## Links

- [CHANGELOG.md][4] - Find out what's new in the latest version

`@kadena-dev/heft-rig` is part of the [Rush Stack][5] family of projects.

[1]: https://www.npmjs.com/package/@rushstack/heft
[2]: https://www.npmjs.com/package/@rushstack/rig-package
[3]:
  https://github.com/microsoft/rushstack/tree/main/rigs/heft-node-rig/profiles/default
[4]:
  https://github.com/microsoft/rushstack/blob/main/rigs/heft-node-rig/CHANGELOG.md
[5]: https://rushstack.io/
