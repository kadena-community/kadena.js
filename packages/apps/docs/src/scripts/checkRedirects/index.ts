import type { IScriptResult } from '@kadena/docs-tools';
import * as fs from 'fs';

import redirects from './../../../redirects.mjs';
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

function checkUrlAgainstList(url: string, urlList: IRedirect[]): IRedirect[] {
  const matchingUrls: IRedirect[] = [];
  for (const listItem of urlList) {
    if (listItem.source) {
      const listItemRegex = new RegExp(
        `^${listItem.source.replace(/:\w+/g, '([^/]+)')}$`,
      );
      if (listItemRegex.test(url)) {
        matchingUrls.push(listItem);
      }
    }
  }

  return matchingUrls;
}

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
    if (
      !sitemapUrls.find((r) => r === val?.destination) &&
      val?.destination &&
      val?.destination !== url
    ) {
      return !!checkImportedRedirectsSlugs(
        val.destination,
        redirects,
        sitemapUrls,
      );
    }
    if (sitemapUrls.find((r) => r === val?.destination)) {
      return true;
    }

    return acc;
  }, false);
};

const checkUrlCreator =
  (sitemapUrls: string[]) =>
  async (url: string, idx: number): Promise<void> => {
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
  return { success, errors };
};
