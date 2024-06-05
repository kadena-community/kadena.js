import { httpRegExp } from '../constants';
import { checkUrlAgainstList } from './checkUrlAgainstList';

export const checkImportedRedirectsSlugs = (
  url: string,
  redirects: IRedirect[],
  sitemapUrls: string[],
): boolean => {
  const matches = checkUrlAgainstList(url, redirects);

  if (matches.length === 0) {
    return false;
  }

  return matches.reduce((acc, val) => {
    if (httpRegExp.test(val)) {
      return true;
    }
    if (!sitemapUrls.find((r) => r === val) && val && val !== url) {
      return !!checkImportedRedirectsSlugs(val, redirects, sitemapUrls);
    }
    if (sitemapUrls.find((r) => r === val)) {
      return true;
    }

    return acc;
  }, false);
};
