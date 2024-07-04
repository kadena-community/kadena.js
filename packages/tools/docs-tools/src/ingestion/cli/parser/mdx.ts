import { remark } from 'remark';
import frontmatter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import inlineLinks from 'remark-inline-links';
import mdx from 'remark-mdx';
import { createParser } from './md';

const remarkInstance = remark()
  .use(frontmatter)
  .use(gfm)
  .use(inlineLinks)
  // @ts-ignore: This is a known issue with the types
  .use(mdx);

export const parser = createParser(remarkInstance);
