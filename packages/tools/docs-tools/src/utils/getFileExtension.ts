import path from 'path';

export const getFileExtension = (filePath: string): string => {
  const extensionWithHash = path.extname(filePath).substring(1);

  //also remove the # at the end of a link
  const extensionArr = extensionWithHash.split(/[?#]/);
  return extensionArr[0];
};
