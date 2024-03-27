import menuData from '@/_generated/menu.json';
import type {
  IConfigTreeItem,
  IMenuData,
  IScriptResult,
} from '@kadena/docs-tools';
import {
  getFileFromNameOfUrl,
  getParentTreeFromPage,
  getUrlNameOfPageFile,
} from '@kadena/docs-tools';
import { constants } from 'buffer';
import * as fs from 'fs';
import xml2js from 'xml2js';
import { getPageFromPath } from '../fixLocalLinks/utils/getPageFromPath';

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

const checkUrlCreator =
  (sitemapUrls: string[]) =>
  async (url: string, idx: number): Promise<void> => {
    const found = sitemapUrls.find((r) => r === url);
    if (!found) {
      console.log(url);
    }
  };

export const checkRedirects = async (): Promise<IScriptResult> => {
  const productionSitemapUrls = await getProductionSitemapLinks();
  const sitemapUrls = await getSitemapLinks();

  const checkUrl = checkUrlCreator(sitemapUrls);

  productionSitemapUrls.forEach(checkUrl);
  return { success, errors };
};

checkRedirects();
