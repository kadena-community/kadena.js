import { hasSameBasePath } from '../hasSameBasePath';

describe('utils hasSameBasePath', () => {
  it('return true when the start of the paths are equal', () => {
    expect(hasSameBasePath('/kadena', '/kadena/het-is-me-wat')).toEqual(true);

    expect(hasSameBasePath('/kadena', '/kadena')).toEqual(true);

    expect(hasSameBasePath('/kadena', '/Kadena')).toEqual(true);
  });

  it('return false when the start of the paths are not equal', () => {
    expect(hasSameBasePath('/kadena', '/pact')).toEqual(false);
  });
});
