import { errors, typedRedirects } from './../constants';
import { checkImportedRedirectsSlugs } from './checkImportedRedirectsSlugs';

export const checkUrlCreator =
  (sitemapUrls: string[]) =>
  (url: string): void => {
    const found = sitemapUrls.find((r) => r === url);
    if (found) return;
    if (
      !found &&
      !checkImportedRedirectsSlugs(url, typedRedirects, sitemapUrls)
    ) {
      errors.push(`${url} has no working redirect`);
    }
  };
