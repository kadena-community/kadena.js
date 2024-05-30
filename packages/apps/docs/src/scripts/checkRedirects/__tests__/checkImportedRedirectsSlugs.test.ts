import fsPromises from 'fs/promises';
import { getSitemapLinkstoArray } from '../utils';
import { checkImportedRedirectsSlugs } from '../utils/checkImportedRedirectsSlugs';
import { redirects } from './../../__mocks__/redirects.mock';

describe('checkImportedRedirectsSlugs', () => {
  let sitemapURLs: string[];
  beforeEach(async () => {
    const xml = await fsPromises.readFile(
      `${process.cwd()}/src/scripts/__mocks__/sitemap.mock.xml`,
    );
    sitemapURLs = await getSitemapLinkstoArray(xml);
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return false if there are no matches', () => {
    const result = checkImportedRedirectsSlugs(
      '/test/this/does/not/exist',
      redirects,
      sitemapURLs,
    );
    expect(result).toBe(false);
  });
  it('should return true if there are matches in redirects', () => {
    const result = checkImportedRedirectsSlugs(
      '/he-man',
      redirects,
      sitemapURLs,
    );
    expect(result).toBe(true);
  });
  it('should return true if there are matches in redirects that need to be redirected again', () => {
    const result = checkImportedRedirectsSlugs(
      '/skeletor',
      redirects,
      sitemapURLs,
    );
    expect(result).toBe(true);
  });

  it('should return true if we are testing an external link', () => {
    const result = checkImportedRedirectsSlugs(
      '/cringer',
      redirects,
      sitemapURLs,
    );
    expect(result).toBe(true);
  });
});
