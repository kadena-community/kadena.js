import { convertFile } from '../utils/convertFile';
import { getLastModifiedDate } from '../utils/getLastModifiedDate';

const mocks = vi.hoisted(() => {
  return {
    readFileSync: vi.fn(),
    getFrontMatter: vi.fn(),
    getFrontmatterFromTsx: vi.fn(),
    getLastModifiedDate: vi.fn(),
    isMarkDownFile: vi.fn(),
  };
});

describe('convertFile', () => {
  const frontmatter = {
    title: 'Intro to Chainweb',
    menu: 'Chainweb API',
    subTitle: 'Build the future on Kadena',
    label: 'Introduction',
    order: 5,
    description: 'Welcome to Chainwebs documentation!',
    layout: 'redocly',
  };

  const frontmatterWithTSX = {
    title: 'Intro to Chainweb with TSX',
    menu: 'Chainweb API',
    subTitle: 'Build the future on Kadena',
    label: 'Introduction',
    order: 5,
    description: 'Welcome to Chainwebs documentation!',
    layout: 'redocly',
  };

  beforeEach(() => {
    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        readFileSync: mocks.readFileSync.mockReturnValue(
          'Masters of the universe. I have the power!!',
        ),
      };
    });
    vi.mock('./../utils/getFrontMatter', async () => {
      return {
        getFrontMatter: mocks.getFrontMatter,
      };
    });
    vi.mock('./../utils/getLastModifiedDate', async () => {
      return {
        getLastModifiedDate: mocks.getLastModifiedDate.mockResolvedValue(
          'Thu, 13 Oct 1977 00:00:00 GMT',
        ),
      };
    });
    vi.mock('@kadena/docs-tools', async () => {
      const actual = (await vi.importActual('@kadena/docs-tools')) as {};
      return {
        ...actual,
        getFrontmatterFromTsx: mocks.getFrontmatterFromTsx,
        isMarkDownFile: mocks.isMarkDownFile,
      };
    });
  });

  it('should return the correct frontmatter if file is markdown', async () => {
    mocks.isMarkDownFile.mockReturnValue(true);
    mocks.getFrontMatter.mockReturnValue(frontmatter);
    const result = await convertFile('./src/he-man');

    expect(result).toEqual({
      ...frontmatter,
      readingTimeInMinutes: 1,
      wordCount: 8,
      isActive: false,
      isIndex: false,
      isMenuOpen: false,
      lastModifiedDate: 'Thu, 13 Oct 1977 00:00:00 GMT',
    });
  });

  it('should return the correct frontmatter with lastmodifieddate if file is markdown and markdown has already lastmodifieddate', async () => {
    mocks.isMarkDownFile.mockReturnValue(true);
    mocks.getFrontMatter.mockReturnValue({
      ...frontmatter,
      lastModifiedDate: 'Tue, 04 Jun 2013 11:00:00 GMT',
    });
    const result = await convertFile('./src/he-man');

    //first check that getLastModifieddate function always returns 13th of october
    const resultDate = await getLastModifiedDate('');
    expect(resultDate).toEqual('Thu, 13 Oct 1977 00:00:00 GMT');

    //the date is different here, so it actually comes from the frontmatter
    expect(result).toEqual({
      ...frontmatter,
      readingTimeInMinutes: 1,
      wordCount: 8,
      isActive: false,
      isIndex: false,
      isMenuOpen: false,
      lastModifiedDate: 'Tue, 04 Jun 2013 11:00:00 GMT',
    });
  });

  it('should return the correct frontmatter if file is tsx', async () => {
    mocks.isMarkDownFile.mockReturnValue(false);
    mocks.getFrontmatterFromTsx.mockReturnValue(frontmatterWithTSX);
    const result = await convertFile('./src/he-man');

    expect(result).toEqual({
      ...frontmatterWithTSX,
      readingTimeInMinutes: 1,
      wordCount: 8,
      isActive: false,
      isIndex: false,
      isMenuOpen: false,
      lastModifiedDate: 'Thu, 13 Oct 1977 00:00:00 GMT',
    });
  });
  it('should return undefined if there is no data', async () => {
    mocks.isMarkDownFile.mockReturnValue(true);
    mocks.getFrontMatter.mockReturnValue(undefined);
    const result = await convertFile('./src/he-man');

    expect(result).toEqual(undefined);
  });
});
