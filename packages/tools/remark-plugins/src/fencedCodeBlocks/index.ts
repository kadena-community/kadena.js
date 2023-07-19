import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const shellLanguages = ['sh', 'shell', 'bash', 'zsh'];

export const fencedCodeBlocks: Plugin = () => {
  return (tree) => {
    visit(tree, 'code', (node: any) => {
      if (node.lang === null) node.lang = ' ';
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (node.lang && shellLanguages.includes(node.lang)) node.lang = 'sh';
    });
  };
};
