---
'@kadena/explorer': patch
'@kadena/graph': patch
---

Improve performance by memoizing networkInfo result in graph every 30 seconds.
Skipping in explorer when there's an error. Added block info to row-block
component on main page
