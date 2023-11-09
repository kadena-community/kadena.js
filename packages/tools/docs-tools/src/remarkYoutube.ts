import type { ITree, Plugin, RootContent } from "./types";

const getYouTubeVideoId = (link: string): string | undefined => {
  if (!link) return;
  const youtubeRegExp =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?([a-zA-Z0-9_-]{11})/;
  const match = link.match(youtubeRegExp);

  if (match && match[5]) {
    return match[5];
  }
  return;
};

const remarkYoutube = (): Plugin => {
  return async (tree: ITree) => {
    const children = tree.children.map((node) => {
      if (node.type === 'paragraph' && node.children?.length === 1) {
        const leaf = node.children[0] ?? null;

        if(leaf.type !== 'link') return node;

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

          // @ts-ignore
          delete newNode.children;
          return newNode;
        }
      }
      return node;
    });

    tree.children = children as RootContent[];
    return tree;
  };
};

export { remarkYoutube as default };
