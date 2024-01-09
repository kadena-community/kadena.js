import { getFileFromNameOfUrl } from '../getFileFromNameOfUrl';
import { loadConfigPages } from './../loadConfigPages.mock';

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
    const result = getFileFromNameOfUrl('/contribute/ambassadors/moderator');
    const expectedResult = {
      url: '/moderator',
      file: '/contribute/ambassadors/moderator.md',
      id: 'moderator',
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it('should return undefined when the url is not found', async () => {
    const result = getFileFromNameOfUrl('/he-man/skeletor');
    expect(result).toStrictEqual(undefined);
  });
});
