import { isIgnoredImage } from '../utils/isIgnoredImage';

describe('isIgnoredImage', () => {
  const ignoredAssets: string[] = [
    './public/assets/docs/he-man.png',
    './public/assets/docs/teela-Na.png',
    './public/assets/docs/skeletor.png',
  ];
  it('should return true if the image is in the ignored list', async () => {
    const path = './public/assets/docs/teela-na.png';
    const expectedResult = true;

    const result = isIgnoredImage(ignoredAssets, path);
    expect(result).toEqual(expectedResult);
  });

  it('should return false if the image is NOT the ignored list', async () => {
    const path = './public/assets/greyskull/he-man.png';
    const expectedResult = false;

    const result = isIgnoredImage(ignoredAssets, path);
    expect(result).toEqual(expectedResult);
  });

  it('should return true if the image is in the ignored list with cleanedpath', async () => {
    const path = '/assets/docs/teela-Na.png';
    const expectedResult = true;

    const result = isIgnoredImage(ignoredAssets, path);
    expect(result).toEqual(expectedResult);
  });
});
