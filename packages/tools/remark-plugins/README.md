# @kadena-dev/remark-plugins

## Included Plugins

### External

- `remark-frontmatter` to support YAML frontmatter
- `remark-prettier` to format using Prettier
- `remark-gfm` to support GitHub Formatted Markdown
- `remark-reference-links` converts `[](https://...)` links to `[][0]` refs
- `remark-order-reference-links` orders the link refs from the previous plugin

### Internal

- `handleCommentMarkers` replaces content between comment markers (`mdast-zone`)

## Format Markdown file

Make sure the package is built (`rush build`).

Format a single Markdown file and output the result to `stdout`:

```bash
pnpm dlx remark-cli --use ./packages/tools/remark-plugins/lib/index.js README.md
```

Format a single Markdown file and overwrite the same file:

```bash
pnpm dlx remark-cli --use ./packages/tools/remark-plugins/lib/index.js README.md -o
```

Use globs (e.g. `*.md`) to format multiple files at once.

## Add new directive

Example:

```md
<!--mySection start -->

<!--mySection end -->
```

Make sure `directives/index.js` exports the `mySection` function and returns an
[mdast tree][1]. Must be sync (not `async`).

Restrictions (from the `mdast-comment-marker` and `mdast-zone` plugins):

- No space between opening and directive name.
- Use camelCase for directive name (e.g. no underscores, etc).
- Use lowercase `start` and `end`

[1]: https://github.com/syntax-tree/mdast
