import { getCleanedHash } from '../getCleanedHash';

describe('utils getCleanedHash', () => {
  it('should just return the deeplink without the hash', async () => {
    const deeplinkHash = '#test-this-parth-343443';
    const expectedResult = '#test-this-part';
    expect(getCleanedHash(deeplinkHash)).toEqual(expectedResult);
  });
  it('should just return the deeplink when there is no hash', async () => {
    const deeplinkHash = '#test-this-part';
    const expectedResult = '#test-this-part';
    expect(getCleanedHash(deeplinkHash)).toEqual(expectedResult);
  });
});
