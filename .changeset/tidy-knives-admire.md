---
'@kadena/pactjs-cli': major
---

Move `.kadena/pactjs-generated` one level up, out of `node_modules`

Migration is done by moving  `.kadena/pactjs-generated` from `types` to `include` in `tsconfig.json`.

Before:

```json
{
  "compilerOptions": {
    "types": [".kadena/pactjs-generated"]
  },
}

```

After:

```json
{
  "compilerOptions": {
    "types": []
  },
  "include": [".kadena/pactjs-generated"]
}
```
