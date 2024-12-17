---
'@kadena/explorer': minor
---

Various QoL improvements for Explorer

- show specific messages when account, block or transactions are not found (this
  can be extended to show the search query on other networks)
- when switching networks, the url will be preserved
- added logic to use `?networkId=<networkid>` in query string parameter to
  improve navigating from external sources
