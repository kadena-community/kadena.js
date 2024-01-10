import { getUrlofImageFile } from '../getUrlofImageFile';

describe('utils getUrlofImageFile', () => {
  it('should return the correct image url from the string', async () => {
    expect(getUrlofImageFile('../../public/assets/blog/test.webp')).toEqual(
      '/assets/blog/test.webp',
    );
    expect(getUrlofImageFile('./../../public/assets/blog/test.webp')).toEqual(
      '/assets/blog/test.webp',
    );
  });
});
