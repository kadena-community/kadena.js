---
'@kadena/graph': patch
---

Changed the way object relations are handled. Instead of performing multiple
queries we use prisma's relation to select the object
