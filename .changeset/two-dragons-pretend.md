---
'@kadena/client': patch
---

Expose two new functions:
- `getHostUrl` to use with `@kadena/client-utils` package
- `submitOne` to make piping easier. As the piped arguments can be ambiguous 
  (array or single transaction)
