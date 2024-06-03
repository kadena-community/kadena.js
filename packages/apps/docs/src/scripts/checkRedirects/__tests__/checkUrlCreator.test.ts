import fsPromises from 'fs/promises';
import { errors } from '../constants';
import { checkUrlCreator } from '../utils/checkUrlCreator';
import { getSitemapLinks } from '../utils/getSitemapLinks';

const mocks = vi.hoisted(() => {
  return {
    readFileSync: vi.fn(),
    checkImportedRedirectsSlugs: vi.fn(),
  };
});

describe('checkUrlCreator', () => {
  let sitemapURLs: string[];
  let checkURL: (url: string) => void;
  beforeEach(async () => {
    errors.length = 0;
    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        readFileSync: mocks.readFileSync,
      };
    });
    vi.mock('./../utils/checkImportedRedirectsSlugs', () => {
      return {
        checkImportedRedirectsSlugs: mocks.checkImportedRedirectsSlugs,
      };
    });

    const xml = await fsPromises.readFile(
      `${process.cwd()}/src/scripts/__mocks__/sitemap.mock.xml`,
    );
    mocks.readFileSync.mockReturnValue(xml);
    sitemapURLs = await getSitemapLinks();

    checkURL = checkUrlCreator(sitemapURLs);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should not cause error, if the url is found in sitemap', () => {
    expect(errors.length).toBe(0);
    checkURL('/build');
    expect(errors.length).toBe(0);
  });
  it('should cause error, if the url is NOT found in sitemap or in redirects', () => {
    mocks.checkImportedRedirectsSlugs.mockReturnValue(false);
    expect(errors.length).toBe(0);
    checkURL('/skeletor/mastersoftheuniverse');
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe(
      '/skeletor/mastersoftheuniverse has no working redirect',
    );
  });
  it('should not cause error, if the url is NOT found in sitemap but has redirects', () => {
    mocks.checkImportedRedirectsSlugs.mockReturnValue(true);
    expect(errors.length).toBe(0);
    checkURL('/skeletor/mastersoftheuniverse');
    expect(errors.length).toBe(0);
  });
});
