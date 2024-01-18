// returns just the complete deeplink hash of a filepath
export const getLinkHash = (filePath: string): string | undefined => {
  const arr = filePath.split('/');
  const extensionWithHashArr = arr[arr.length - 1].split('.');

  //also remove the # at the end of a link
  const extensionArr =
    extensionWithHashArr[extensionWithHashArr.length - 1].split('#');

  if (extensionArr.length < 2) return;

  return extensionArr[1];
};
