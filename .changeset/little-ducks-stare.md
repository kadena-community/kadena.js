---
'@kadena-dev/eslint-config': major
'@kadena/chainweb-stream-client': none
'@kadena/chainweb-node-client': none
'@kadena/cryptography-utils': none
'@kadena/immutable-records': none
'@kadena/pactjs-generator': none
'@kadena/react-components': none
'@kadena/client-examples': none
'@kadena-dev/markdown': none
'@kadena-dev/eslint-plugin': none
'@kadena-dev/lint-package': none
'@kadena/graph-client': none
'@kadena/pactjs-cli': none
'@kadena/chainwebjs': none
'kadena.js': none
'@kadena/cookbook': none
'@kadena-dev/heft-rig': none
'@kadena/react-ui': none
'@kadena/kda-cli': none
'@kadena-dev/scripts': none
'@kadena/client': none
'@kadena/pactjs': none
'@kadena/graph': none
'@kadena/tools': none
'@kadena/types': none
'@kadena/docs': none
---

Separate linting (ESLint) and formatting (Prettier)

Adds `eslint-config-prettier` and removes `eslint-plugin-prettier`.
The formatting that Prettier did is removed (also in `--fix` runs).
Apply formatting separately using Prettier (`--write` or `--check`).
