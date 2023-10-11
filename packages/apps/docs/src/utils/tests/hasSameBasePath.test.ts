import { hasSameBasePath } from '../hasSameBasePath';

describe('utils hasSameBasePath', () => {
  it('return true when the start of the paths are equal', () => {
    expect(
      hasSameBasePath('/docs/kadena', '/docs/kadena/het-is-me-wat'),
    ).toEqual(true);

    expect(hasSameBasePath('/docs/kadena', '/docs/kadena')).toEqual(true);

    expect(hasSameBasePath('/docs/kadena', '/docs/Kadena')).toEqual(true);
  });

  it('return false when the start of the paths are not equal', () => {
    expect(hasSameBasePath('/docs/kadena', '/docs/pact')).toEqual(false);
  });
});
