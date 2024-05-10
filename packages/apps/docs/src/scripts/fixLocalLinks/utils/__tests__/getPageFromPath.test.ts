import { getPageFromPath } from '../getPageFromPath';

describe('utils getPageFromPath', () => {
  it('should return IConfigTreeItem for given file path', async () => {
    const filepath = 'src/docs/build/frontend/kadena-graph.md';
    const result = await getPageFromPath(filepath);
    expect(result).toEqual({
      file: '/build/frontend/kadena-graph.md',
      id: 'kadena-graph',
      url: '/kadena-graph',
    });
  });

  it('should return IConfigTreeItem for given file path when it does not start with src/docs', async () => {
    const filepath = '/build/frontend/kadena-graph.md';
    const result = await getPageFromPath(filepath);
    expect(result).toEqual({
      file: '/build/frontend/kadena-graph.md',
      id: 'kadena-graph',
      url: '/kadena-graph',
    });
  });

  it('should return undefined if file does not exist', async () => {
    const filepath = '/he-man/greyskull#masters-of-the-universe.md';
    const result = await getPageFromPath(filepath);
    expect(result).toEqual(undefined);
  });
});
