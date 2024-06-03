import fsPromises from 'fs/promises';
import { checkRedirects } from '..';
import { errors, success } from '../constants';
import { getSitemapLinks } from '../utils/getSitemapLinks';

const mocks = vi.hoisted(() => {
  return {
    checkUrl: vi.fn(),
    checkUrlCreator: vi.fn(),
    getProductionSitemapLinks: vi.fn(),
    readFileSync: vi.fn(),
  };
});

describe('checkRedirects', () => {
  let sitemapURLs: string[];
  beforeEach(async () => {
    errors.length = 0;
    success.length = 0;

    const xml = await fsPromises.readFile(
      `${process.cwd()}/src/scripts/__mocks__/sitemap.mock.xml`,
    );
    mocks.readFileSync.mockReturnValue(xml);
    sitemapURLs = await getSitemapLinks();

    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        readFileSync: mocks.readFileSync,
      };
    });

    vi.mock('./../utils/checkUrlCreator', () => {
      return {
        checkUrlCreator: mocks.checkUrlCreator.mockReturnValue(mocks.checkUrl),
      };
    });
    vi.mock('./../utils/getProductionSitemapLinks', async () => {
      return {
        getProductionSitemapLinks: mocks.getProductionSitemapLinks,
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return success if all redirects work', async () => {
    mocks.getProductionSitemapLinks.mockReturnValue(sitemapURLs);
    expect(errors.length).toBe(0);
    await checkRedirects();
    expect(errors.length).toBe(0);
    expect(mocks.checkUrlCreator).toBeCalledTimes(1);
    expect(mocks.checkUrl).toBeCalledTimes(sitemapURLs.length);
    expect(mocks.checkUrl).toHaveBeenNthCalledWith(
      2,
      '/search',
      1,
      sitemapURLs,
    );
  });
  it('should return errors if no redirect work', async () => {
    mocks.getProductionSitemapLinks.mockReturnValue(sitemapURLs);
    mocks.checkUrlCreator.mockReturnValue(() => errors.push('error'));
    expect(errors.length).toBe(0);
    await checkRedirects();
    expect(errors.length).toBe(158);
    expect(mocks.checkUrlCreator).toBeCalledTimes(1);
    expect(errors[0]).toBe('error');
  });
});
