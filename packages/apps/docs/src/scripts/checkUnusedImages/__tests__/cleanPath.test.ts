import { cleanPath } from '../utils/cleanPath';

describe('cleanPath', () => {
  it('should return the correct url path of the image', async () => {
    const path = './public/assets/docs/he-man.png';
    const expectedResult = '/assets/docs/he-man.png';

    const result = cleanPath(path);
    expect(result).toEqual(expectedResult);
  });

  it('should return the correct url path of the image lowercase', async () => {
    const path = '/assets/GReySkull/skeletor.png';
    const expectedResult = '/assets/greyskull/skeletor.png';

    const result = cleanPath(path);
    expect(result).toEqual(expectedResult);
  });
});
