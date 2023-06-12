import remarkFrontMatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkPrettier from 'remark-prettier';
import remarkGFM from 'remark-gfm';
import remarkReferenceLinks from 'remark-reference-links';
import remarkOrderLinks from 'remark-order-reference-links';
import { handleCommentMarkers } from './handleCommentMarkers.js';
import * as commentMarkers from './commentMarkers/index.js';

const remarkPresetKadena = {
  settings: {},
  plugins: [
    remarkFrontMatter,
    remarkParse,
    [handleCommentMarkers, commentMarkers],
    remarkPrettier,
    remarkGFM,
    remarkReferenceLinks,
    remarkOrderLinks,
  ],
};

export default remarkPresetKadena;
