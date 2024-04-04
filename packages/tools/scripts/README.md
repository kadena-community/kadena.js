# Scripts

Convert Rush changelog (`common/changes/**/*.json`) to Changesets
(`.changesets/*.md`) format:

```sh
npx tsx packages/tools/scripts/convert-changelog.ts
```

Generate `packages.json` in root:

```sh
npx tsx packages/tools/scripts/generate-packages-json.ts
```

Publish one, set, or all packages (from root):

```sh
pnpm publish-set
```

testetst
