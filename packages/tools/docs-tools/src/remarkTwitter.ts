import type { Root, RootContentMap, RootContent, RootData, PhrasingContent, Resource, Link } from 'mdast';
import type { Parent } from 'unist';

interface Tree extends Omit<Root, 'children'> {
  children: RootContent[];
}

interface Children extends RootContentMap {
  paragraph: PhrasingContent[];
  link: Link[];
}

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

const remarkTwitter = () => {
  return async (tree: Tree):  => {
    const children = tree.children.map((node) => {
      if (node.type === 'paragraph' && node.children?.length === 1) {
        const leaf = node.children?.[0] ?? null;
        if(leaf.type === 'link') {
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

            // @ts-ignore
            delete newNode.children;
            return newNode;
          }
        }
      }
      return node;
    });

    tree.children = children;
    return tree;
  };
};

export { remarkTwitter as default };
