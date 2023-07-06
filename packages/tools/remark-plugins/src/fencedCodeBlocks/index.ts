import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';

const shellLanguages = ['sh', 'shell', 'bash', 'zsh'];

export function fencedCodeBlocks() {
  return (tree: Root) => {
    visit(tree, 'code', (node) => {
      if (node.lang === null) node.lang = ' ';
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (node.lang && shellLanguages.includes(node.lang)) node.lang = 'sh';
    });
  };
}
