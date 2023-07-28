import * as commentMarkers from './commentMarkers/index.js';
import { fencedCodeBlocks } from './fencedCodeBlocks/index.js';
import { handleCommentMarkers } from './handleCommentMarkers.js';

import remarkFrontMatter from 'remark-frontmatter';
import remarkGFM from 'remark-gfm';
import remarkOrderLinks from 'remark-order-reference-links';
import remarkParse from 'remark-parse';
import unifiedPrettier from 'unified-prettier';
import remarkReferenceLinks from 'remark-reference-links';
import type { Preset } from 'unified';

const remarkPresetKadena: Preset = {
  settings: {},
  plugins: [
    remarkFrontMatter,
    remarkParse,
    [handleCommentMarkers, commentMarkers],
    unifiedPrettier,
    remarkGFM,
    fencedCodeBlocks,
    remarkReferenceLinks,
    remarkOrderLinks,
  ],
};

export default remarkPresetKadena;
