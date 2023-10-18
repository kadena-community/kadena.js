import remarkFrontMatter from 'remark-frontmatter';
import remarkGFM from 'remark-gfm';
import remarkOrderLinks from 'remark-order-reference-links';
import remarkParse from 'remark-parse';
import remarkReferenceLinks from 'remark-reference-links';
import type { Preset } from 'unified';
import unifiedPrettier from 'unified-prettier';
import * as commentMarkers from './commentMarkers/index.js';
import { fencedCodeBlocks } from './fencedCodeBlocks/index.js';
import { handleCommentMarkers } from './handleCommentMarkers.js';

const remarkPresetKadena: Preset = {
  settings: {},
  plugins: [
    // @ts-expect-error Will vanish when upgrading packages
    remarkFrontMatter,
    remarkParse,
    [handleCommentMarkers, commentMarkers],
    unifiedPrettier,
    // @ts-expect-error Will vanish when upgrading packages
    remarkGFM,
    fencedCodeBlocks,
    remarkReferenceLinks,
    remarkOrderLinks,
  ],
};

export default remarkPresetKadena;
