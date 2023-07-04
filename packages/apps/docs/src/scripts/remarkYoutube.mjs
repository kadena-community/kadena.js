/**
 * This replace a link to youtube with a embed youtube movie
 * @param {*} tree
 * @returns
 */

const getYouTubeVideoId = (link) => {
  if (!link) return;
  const youtubeRegExp =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?([a-zA-Z0-9_-]{11})/;
  const match = link.match(youtubeRegExp);

  if (match && match[5]) {
    return match[5];
  }
  return;
};

const remarkYoutube = () => {
  return async (tree) => {
    const children = tree.children.map((node) => {
      if (node.children && node.children[0]) {
        const leaf = node.children[0] ?? null;
        const videoId = getYouTubeVideoId(leaf.url);

        if (videoId) {
          const newNode = {
            ...leaf,
            ...node,
            type: 'element',
            value: leaf.url,
            data: {
              hName: 'kda-youtube',
              hProperties: {
                videoId,
                title: leaf.title,
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

export { remarkYoutube as default };
