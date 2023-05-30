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
    const children = tree.children.map((branch) => {
      if (branch.children && branch.children[0]) {
        const leaf = branch.children[0] ?? null;
        const videoId = getYouTubeVideoId(leaf.url);

        if (videoId) {
          const newBranch = {
            ...leaf,
            ...branch,
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

          delete newBranch.children;
          return newBranch;
        }
      }
      return branch;
    });

    tree.children = children;
    return tree;
  };
};

export { remarkYoutube as default };
