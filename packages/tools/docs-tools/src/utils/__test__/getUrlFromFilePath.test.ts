import { getUrlFromFilePath } from '../getUrlFromFilePath';

describe('utils getUrlFromFilePath', () => {
  it('should return the url of a filePath string', async () => {
    const filepath = '/apps/docs/src/pages/build/guides/index.md';
    const result = '/build/guides';

    expect(getUrlFromFilePath(filepath)).toEqual(result);
  });

  it('should return the url of a filePath string with different filename extension', async () => {
    const filepath = '/apps/docs/src/pages/build/guides/index.tsx';
    const result = '/build/guides';

    expect(getUrlFromFilePath(filepath)).toEqual(result);
  });
});
