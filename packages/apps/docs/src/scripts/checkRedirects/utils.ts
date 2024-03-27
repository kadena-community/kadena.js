import xml2js from 'xml2js';

export const getSitemapLinkstoArray = async (xml: any): Promise<string[]> => {
  const parser = new xml2js.Parser();
  const json = await parser.parseStringPromise(xml);
  return json.urlset.url.map((obj: any) =>
    obj.loc[0].replace('https://docs.kadena.io', ''),
  );
};
