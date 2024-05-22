import { isParent } from '@/scripts/utils';
import type { Node, Text } from 'mdast';

export const crawlContent = (tree: Node): string => {
  let content = '';

  const innerCrawl = (tree: Node): string => {
    if (isParent(tree)) {
      tree.children?.forEach((branch) => {
        const text = (branch as Text).value;
        if (text) {
          content = `${content}${text}`;
          return content;
        }
        return innerCrawl(branch);
      });
    }
    return content;
  };

  innerCrawl(tree);

  return content;
};
