import { getSitemapLinkstoArray } from '../utils';

describe('getSitemapLinkstoArray', () => {
  it('should return an array of all urls without the root', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://docs.kadena.io/</loc>
    </url>
    <url>
        <loc>https://docs.kadena.io/search</loc>
    </url>
    <url>
        <loc>https://docs.kadena.io/changelogs</loc>
    </url>
    </urlset>`;

    const result = await getSitemapLinkstoArray(xml);

    expect(result.length).toBe(3);
    expect(result[2]).toBe('/changelogs');
  });
});
