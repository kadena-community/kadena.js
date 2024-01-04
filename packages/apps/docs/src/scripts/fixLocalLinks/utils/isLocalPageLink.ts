import { getFileExtension } from '@kadena/docs-tools';
import type { Image } from 'mdast-util-from-markdown/lib';

//checks if the given link is a local file
export const isLocalPageLink = (url: string): boolean => {
  const extension = getFileExtension(url);

  return (
    !url.startsWith('http') &&
    (extension === 'md' || extension === 'mdx' || extension === 'tsx')
  );
};

export const isLocalImageLink = (link: Image): boolean => {
  const url = link.url;
  return !url.startsWith('http') && url.includes('public/assets');
};
