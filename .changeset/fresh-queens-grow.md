---
'@kadena/explorer': patch
---

fix when the network slug is testnet04 or mainnet01 it does not redirect to
mainnet (we were testing on slug.startsWith, so when the slug was mainnet01, it
found slug: mainnet) and crashed
