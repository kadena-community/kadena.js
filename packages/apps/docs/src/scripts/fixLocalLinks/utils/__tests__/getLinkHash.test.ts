import { getLinkHash } from '../getLinkHash';

describe('utils getLinkHash', () => {
  it('should return the deeplink hash from a filepath', async () => {
    const filepath = '/he-man/greyskull#masters-of-the-universe';
    const expectedResult = 'masters-of-the-universe';
    expect(getLinkHash(filepath)).toEqual(expectedResult);
  });

  it('should return empty string if filepath does not have a deeplinkhash', async () => {
    const filepath = '/he-man/greyskull';
    expect(getLinkHash(filepath)).toEqual(undefined);
  });
});
