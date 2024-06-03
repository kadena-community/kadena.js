import fsPromises from 'fs/promises';
import { getSitemapLinks } from '../utils/getSitemapLinks';

const mocks = vi.hoisted(() => {
  return {
    readFileSync: vi.fn(),
  };
});

describe('getSitemapLinks', () => {
  beforeEach(() => {
    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        readFileSync: mocks.readFileSync,
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return the list of links', async () => {
    const xml = await fsPromises.readFile(
      `${process.cwd()}/src/scripts/__mocks__/sitemap.mock.xml`,
    );
    mocks.readFileSync.mockReturnValue(xml);
    const result = await getSitemapLinks();
    expect(result.length).toBe(158);
  });
});
