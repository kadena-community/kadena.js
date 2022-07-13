This document contains **rationale** for decisions that have been made that are
repo-wide Specific rationale will be added to their respective READMEs or inline

- [Rush](#rush)
- [Eslint](#eslint)

# Rush

We use rush to manage our monorepo. Have a look at
[The Rush difference](https://rushjs.io/) for in depth reasons

Main reasons:

- builds around the node/npm ecosystem, with at it's core the `package.json`.
  Not a proprietary or typescript-only approach
- strict ruleset for linting, dependencies etc to have high quality open source
  libraries

# Eslint

Whatever is auto-fixable, should be auto-fixed. We do not want unnecessary
burden by thinking about coding standards. This allows contributers to focus on
value adding, not on style:

- use of semi-colons
- use of parens
- use of quotes
- trailing commas
- tabs and spaces (2)
- print width
- import order
- imports from the same package
- type imports
- package.json (scripts) order
- etc.

Have a look at
[rushstack eslint-config](https://github.com/microsoft/rushstack/tree/main/eslint/eslint-config)
for the rationale

Mixin [tsdoc](@rushstack/eslint-config/mixins/tsdoc) is added because we use
api-extractor
