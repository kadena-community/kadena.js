---
'@kadena/client': minor
---

Add feature to allow signing with keypair:

```ts
const signWithKeystore = createSignWithKeypair([keyPair, keyPair2]);
const [signedTx1, signedTx2] = await signWithKeystore([tx1, tx2]);
const signedTx3 = await signWithKeystore(tx3);
```
