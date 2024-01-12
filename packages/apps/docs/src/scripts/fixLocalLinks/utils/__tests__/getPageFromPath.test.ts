import { getPageFromPath } from '../getPageFromPath';

describe('utils getPageFromPath', () => {
  it('should return IConfigTreeItem for given file path', async () => {
    const filepath =
      'src/docs/contribute/ambassadors/community-channel-leader.md';
    const result = await getPageFromPath(filepath);
    expect(result).toEqual({
      file: '/contribute/ambassadors/community-channel-leader.md',
      id: 'leader',
      url: '/community-channel-leader',
    });
  });

  it('should return IConfigTreeItem for given file path when it does not start with src/docs', async () => {
    const filepath = '/contribute/ambassadors/community-channel-leader.md';
    const result = await getPageFromPath(filepath);
    expect(result).toEqual({
      file: '/contribute/ambassadors/community-channel-leader.md',
      id: 'leader',
      url: '/community-channel-leader',
    });
  });

  it('should return undefined if file does not exist', async () => {
    const filepath = '/he-man/greyskull#masters-of-the-universe.md';
    const result = await getPageFromPath(filepath);
    expect(result).toEqual(undefined);
  });
});
