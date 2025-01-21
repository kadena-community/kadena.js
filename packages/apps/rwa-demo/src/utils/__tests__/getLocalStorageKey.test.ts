import { getLocalStorageKey } from '../getLocalStorageKey';

describe('getLocalStorageKey utils', () => {
  describe('getLocalStorageKey', () => {
    const mocks = vi.hoisted(() => {
      return {
        NETWORKID: 'test',
      };
    });

    beforeEach(() => {
      vi.stubEnv('NEXT_PUBLIC_NETWORKID', 'production');

      vi.mock('./../env', async (importOriginal) => {
        const actual = (await importOriginal()) as {};

        return {
          ...actual,
          env: {
            NETWORKID: mocks.NETWORKID,
          },
        };
      });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should return the correct key with the env variable', () => {
      const result = getLocalStorageKey('skeletor');
      expect(result).toEqual('test-skeletor');
    });
  });
});
