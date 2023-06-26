import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';

export function fencedCodeBlocks() {
  return (tree: Root) => {
    visit(tree, 'code', (node) => {
      if (node.lang === null) node.lang = ' ';
    });
  };
}
