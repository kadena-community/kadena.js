/**
 * This replace a twitter posts link to twitter embed post
 * @param {*} tree
 * @returns
 */

const getTwitterStatusId = (url) => {
  if (!url) return;

  const twitterRegExp =
    /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/(.*\/status\/)?([0-9]*)/;

  const match = url.match(twitterRegExp);

  if (match?.length > 0 && match[5]) {
    return match[5];
  }

  return;
};

const remarkTwitter = () => {
  return async (tree) => {
    const children = tree.children.map((node) => {
      if (node.children && node.children[0]) {
        const leaf = node.children[0] ?? null;

        const twitterStatusId = getTwitterStatusId(leaf?.url);

        if (twitterStatusId) {
          const newNode = {
            ...leaf,
            ...node,
            type: 'element',
            value: leaf.url,
            data: {
              hName: 'kda-tweet',
              hProperties: {
                tweetId: twitterStatusId,
              },
            },
          };

          delete newNode.children;
          return newNode;
        }
      }
      return node;
    });

    tree.children = children;
    return tree;
  };
};

export { remarkTwitter as default };
