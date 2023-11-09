import type { ITree, Plugin, RootContent } from './types';

const getTwitterStatusId = (url: string): string | undefined => {
  if (!url) return;

  const twitterRegExp =
    /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/(.*\/status\/)?([0-9]*)/;

  const match = url.match(twitterRegExp) ?? [];

  if (match.length > 0 && match[5]) {
    return match[5];
  }

  return;
};

const remarkTwitter = (): Plugin => {
  return async (tree: ITree): Promise<ITree> => {
    const children = tree.children.map((node) => {
      if (node.type === 'paragraph' && node.children?.length === 1) {
        const leaf = node.children?.[0] ?? null;
        if(leaf.type !== 'link') return node;

        const twitterStatusId = getTwitterStatusId(leaf.url);
        if (twitterStatusId) {
          const newNode = {
            ...leaf,
            ...node,
            type: 'element',
            value: leaf.url,
            data: {
              ...node.data,
              hName: 'kda-tweet',
              hProperties: {
                tweetId: twitterStatusId,
              },
            },
          };

          newNode.children = [];
          return newNode;
        }
      }
      return node;
    });

    tree.children = children as RootContent[];
    return tree;
  };
};

export { remarkTwitter as default };
