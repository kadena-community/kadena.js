---
'@kadena/pactjs-generator': patch
'@kadena/pactjs-cli': patch
---

Fix index.d.ts by using import instead of export since we use interface merging
for types
