import { loadConfigPages } from 'src/mock/loadConfigPages.mock';
import { getFileFromNameOfUrl } from '../getFileFromNameOfUrl';

vi.mock('@/scripts/movePages', () => {
  return {
    loadConfigPages: loadConfigPages,
  };
});

describe('utils getFileNameOfUrl', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return the page for the given url', async () => {
    const result = await getFileFromNameOfUrl(
      '/contribute/ambassadors/moderator',
    );
    const expectedResult = {
      url: '/moderator',
      file: '/contribute/ambassadors/moderator.md',
      id: 'mod',
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it('should return undefined when the url is not found', async () => {
    const result = await getFileFromNameOfUrl('/he-man/skeletor');
    expect(result).toStrictEqual(undefined);
  });
});
