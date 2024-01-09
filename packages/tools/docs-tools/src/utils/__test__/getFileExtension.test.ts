import { getFileExtension } from '../getFileExtension';

describe('utils getFileExtension', () => {
  it('should return the file extension of a filePath string', async () => {
    const filepath = '../../contribute/test.md';
    const result = 'md';

    expect(getFileExtension(filepath)).toEqual(result);
  });

  it('should return the file extension of a filePath string with a deeplink #', async () => {
    const filepath = '../../contribute/test.mdx#deeplinkh1234';
    const result = 'mdx';

    expect(getFileExtension(filepath)).toEqual(result);
  });

  it('should return the file extension of a filePath string with a deeplink # and a queryparam', async () => {
    const filepath = '../../contribute/test.mdx?id=3#deeplinkh1234';
    const result = 'mdx';

    expect(getFileExtension(filepath)).toEqual(result);
  });
});
