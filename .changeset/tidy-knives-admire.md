---
'@kadena/pactjs-cli': minor
---

Move `.kadena/pactjs-generated` one level up, out of `node_modules`.

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

Currently the generation is done twice during a graceful deprecation period,
with the next major bump the "after" situation is the only situation.
