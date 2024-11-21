---
'@kadena/graph': major
---

BREAKING: removed `totalCount` on any `transfers` connection

We removed this as it caused performance issues. You can rely on `hasNextPage`
and `hasPreviousPage` to determine if there are more pages
