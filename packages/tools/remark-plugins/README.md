# @kadena-dev/remark-plugins

Format a single Markdown file and output the result to `stdout`:

```bash
pnpm dlx remark-cli --use ./packages/tools/remark-plugins/index.js README.md
```

Format a single Markdown file and overwrite the same file:

```bash
pnpm dlx remark-cli --use ./packages/tools/remark-plugins/index.js README.md -o
```
