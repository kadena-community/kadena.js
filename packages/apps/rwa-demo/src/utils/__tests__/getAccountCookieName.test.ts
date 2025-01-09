import { getAccountCookieName } from '../getAccountCookieName';

describe('getAccountCookieName utils', () => {
  describe('getAccountCookieName', () => {
    const mocks = vi.hoisted(() => {
      return {
        NETWORKID: 'test',
        CHAINID: '9',
        ACCOUNT_COOKIE_NAME: 'he-man',
      };
    });

    beforeEach(() => {
      vi.mock('@/constants', async (importOriginal) => {
        const actual = (await importOriginal()) as {};

        return {
          ...actual,
          ACCOUNT_COOKIE_NAME: mocks.ACCOUNT_COOKIE_NAME,
        };
      });
      vi.mock('./../env', async (importOriginal) => {
        const actual = (await importOriginal()) as {};

        return {
          ...actual,
          env: {
            NETWORKID: mocks.NETWORKID,
            CHAINID: mocks.CHAINID,
          },
        };
      });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should use the correct env variables when returning the cookie name', () => {
      expect(getAccountCookieName()).toBe('he-man_test_9');
    });
  });
});
