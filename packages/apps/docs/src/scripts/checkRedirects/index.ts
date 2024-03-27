import type { IScriptResult } from '@kadena/docs-tools';
import * as fs from 'fs';
import xml2js from 'xml2js';
import redirects from './../../../redirects.mjs';

const errors: string[] = [];
const success: string[] = [];

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

const checkImportedRedirects = (
  url: string,
  sitemapUrls: string[],
): boolean => {
  const redirect = redirects.find((r) => r.source === url);

  //if there is a redirect, check that the desitnation exists
  if (
    !sitemapUrls.find((r) => r === redirect?.destination) &&
    redirect?.destination
  ) {
    return !!checkImportedRedirects(redirect?.destination, sitemapUrls);
  }

  return !!sitemapUrls.find((r) => r === redirect?.destination);
};

const checkUrlCreator =
  (sitemapUrls: string[]) =>
  async (url: string, idx: number): Promise<void> => {
    const found = sitemapUrls.find((r) => r === url);
    if (!found && !checkImportedRedirects(url, sitemapUrls)) {
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

checkRedirects();
