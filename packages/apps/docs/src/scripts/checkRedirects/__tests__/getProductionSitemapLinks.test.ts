import fsPromises from 'fs/promises';
import { getProductionSitemapLinks } from '../utils/getProductionSitemapLinks';

const mocks = vi.hoisted(() => {
  return {
    fetch: vi.fn(),
  };
});

describe('getProductionSitemapLinks', () => {
  let xml: string;
  beforeEach(async () => {
    xml = await fsPromises.readFile(
      `${process.cwd()}/src/scripts/__mocks__/sitemap.mock.xml`,
    );
    global.fetch = mocks.fetch;
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should fetch all the sitemap urls', async () => {
    mocks.fetch.mockResolvedValue({
      text: () => new Promise((resolve) => resolve(xml)),
    });
    const result = await getProductionSitemapLinks();
    expect(result.length).toEqual(158);
  });
});
