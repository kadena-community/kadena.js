import { getFileExtension } from '@kadena/docs-tools';

export const isImage = (path: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'webp'];
  const extension = getFileExtension(path);
  return imageExtensions.includes(extension.toLowerCase());
};
