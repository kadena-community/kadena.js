export const refactorAbsoluteDocsLink = (path: string): string => {
  const regExp = /^(https?:\/\/docs\.kadena\.io)/;

  if (path.match(regExp)) return path.replace(regExp, '') || '/';

  return path;
};
