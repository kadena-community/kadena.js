import type { IScriptResult } from '@kadena/docs-tools';
import * as fs from 'fs';

import redirects from './../../redirects/redirects.mjs';
import { getSitemapLinkstoArray } from './utils';

const errors: string[] = [];
const success: string[] = [];

interface IRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

const typedRedirects = redirects as IRedirect[];

const getProductionSitemapLinks = async (): Promise<string[]> => {
  const xml = await fetch('https://docs.kadena.io/sitemap.xml').then((res) =>
    res.text(),
  );
  return getSitemapLinkstoArray(xml);
};

const getSitemapLinks = async (): Promise<string[]> => {
  const xml = fs.readFileSync(
    `${__dirname}/../../../public/sitemap.xml`,
    'utf-8',
  );
  return getSitemapLinkstoArray(xml);
};

export const checkUrlAgainstList = (
  url: string,
  urlList: IRedirect[],
): string[] => {
  const matchingUrls: string[] = [];
  for (const listItem of urlList) {
    if (listItem.source) {
      const listItemRegex = new RegExp(
        `^${listItem.source.replace(/:\w+/g, '([^/]+)')}$`,
      );
      if (listItemRegex.test(url)) {
        const sourceArray = listItem.source.split('/');
        const destinationArray = listItem.destination.split('/');
        const urlArray = url.split('/');
        let isValid = true;

        const newUrlArray = destinationArray.map((slug) => {
          if (!slug.startsWith(':')) return slug;
          const positionIdx = sourceArray.lastIndexOf(slug);

          if (!urlArray[positionIdx]) {
            isValid = false;
            return '';
          }
          return urlArray[positionIdx];
        });

        //if one of the sections is empty, do not return a url
        if (isValid) {
          const newUrl = newUrlArray.join('/');
          matchingUrls.push(newUrl);
        }
      }
    }
  }

  return matchingUrls;
};

const checkImportedRedirectsSlugs = (
  url: string,
  redirects: IRedirect[],
  sitemapUrls: string[],
): boolean => {
  const matches = checkUrlAgainstList(url, redirects);

  if (matches.length === 0) {
    return false;
  }

  return matches.reduce((acc, val) => {
    if (!sitemapUrls.find((r) => r === val) && val && val !== url) {
      return !!checkImportedRedirectsSlugs(val, redirects, sitemapUrls);
    }
    if (sitemapUrls.find((r) => r === val)) {
      return true;
    }

    return acc;
  }, false);
};

const checkUrlCreator =
  (sitemapUrls: string[]) =>
  (url: string, idx: number): void => {
    const found = sitemapUrls.find((r) => r === url);

    if (found) return;
    if (
      !found &&
      !checkImportedRedirectsSlugs(url, typedRedirects, sitemapUrls)
    ) {
      errors.push(`${url} has no working redirect`);
    }
  };

export const checkRedirects = async (): Promise<IScriptResult> => {
  const productionSitemapUrls = await getProductionSitemapLinks();
  const sitemapUrls = await getSitemapLinks();

  const checkUrl = checkUrlCreator(sitemapUrls);
  productionSitemapUrls.forEach(checkUrl);

  if (!errors.length) {
    success.push('There were no redirect issues found');
  }

  return { success, errors };
};
