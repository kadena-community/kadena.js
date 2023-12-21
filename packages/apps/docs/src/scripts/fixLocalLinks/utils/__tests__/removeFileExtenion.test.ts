import { describe, expect, it } from 'vitest';
import { removeFileExtenion } from '../removeFileExtenion';

describe('utils removeFileExtenion', () => {
  it('should return the fielpath without the extension', () => {
    expect(
      removeFileExtenion('../../he-man/mastersoftheuniverse/skelotor.md'),
    ).toEqual('../../he-man/mastersoftheuniverse/skelotor');
  });
  it('should return the fielpath if there is no file extension', () => {
    expect(
      removeFileExtenion('../../he-man/mastersoftheuniverse/skelotor'),
    ).toEqual('../../he-man/mastersoftheuniverse/skelotor');
  });
  it('should return the fielpath without the extension but WITH the # deeplink', () => {
    expect(
      removeFileExtenion('/he-man/mastersoftheuniverse/skelotor.md#greyskull'),
    ).toEqual('/he-man/mastersoftheuniverse/skelotor#greyskull');
  });
});
