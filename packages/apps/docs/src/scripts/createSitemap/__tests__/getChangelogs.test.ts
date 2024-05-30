import { getChangelogs } from '../utils/getChangelogs';

describe('getChangelogs', () => {
  it('should return an string of url strings for all repos', async () => {
    const { default: changelog } = await import(
      './../../__mocks__/changelog.json',
      {
        assert: {
          type: 'json',
        },
      }
    );

    const result = getChangelogs(
      '/changelogs',
      changelog as unknown as IChangelogComplete,
    );

    expect(result).toEqual(`
    <url>
        <loc>/changelogs/kode-ui-components</loc>
        <lastmod>2024-05-08</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>/changelogs/kode-icons</loc>
        <lastmod>2024-04-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>/changelogs/kadena-cli</loc>
        <lastmod>2024-05-13</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>/changelogs/kadenajs</loc>
        <lastmod>2024-04-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>/changelogs/pact</loc>
        <lastmod>2024-05-21</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>`);
  });
});
