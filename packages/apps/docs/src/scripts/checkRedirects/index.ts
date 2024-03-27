import type { IScriptResult } from '@kadena/docs-tools';
import * as fs from 'fs';
import xml2js from 'xml2js';
import redirects from './../../../redirects.mjs';

const errors: string[] = [];
const success: string[] = [];

interface IRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

const typedRedirects = redirects as IRedirect[];

const getSitemapLinkstoArray = async (xml: any): Promise<string[]> => {
  const parser = new xml2js.Parser();

  const json = await parser.parseStringPromise(xml);

  return json.urlset.url.map((obj: any) =>
    obj.loc[0].replace('https://docs.kadena.io', ''),
  );
};

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

// checking the url part by part.
// we go through all the urls and keep the ones that match the first part or :slug
// then we are gonna check the next part (keeping the slug ones)
// until we have done all the parts
// if we have 1 or more that match, there is a working redirect for this URL

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

// this just checks all the redirects we have. if they math
// when they match we need to check if the desitnation is still valid as well
// const checkImportedRedirects = (
//   url: string,
//   sitemapUrls: string[],
// ): boolean => {
//   const redirect = redirects.find((r) => r.source === url);

//   //if there is a redirect, check that the desitnation exists
//   if (
//     !sitemapUrls.find((r) => r === redirect?.destination) &&
//     redirect?.destination
//   ) {
//     return !!checkImportedRedirects(redirect?.destination, sitemapUrls);
//   }

//   return !!sitemapUrls.find((r) => r === redirect?.destination);
// };

const checkUrlCreator =
  (sitemapUrls: string[]) =>
  async (url: string, idx: number): Promise<void> => {
    const found = sitemapUrls.find((r) => r === url);

    if (found) return;

    console.log(
      22,
      checkImportedRedirectsSlugs(url, typedRedirects, sitemapUrls),
    );
    if (
      !found &&
      // !checkImportedRedirects(url, sitemapUrls) &&
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

  console.log({ success, errors });
  return { success, errors };
};
