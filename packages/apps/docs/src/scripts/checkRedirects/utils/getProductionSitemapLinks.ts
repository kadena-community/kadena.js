import { getSitemapLinkstoArray } from '../utils';

export const getProductionSitemapLinks = async (): Promise<string[]> => {
  const xml = await fetch('https://docs.kadena.io/sitemap.xml').then((res) =>
    res.text(),
  );
  return getSitemapLinkstoArray(xml);
};
