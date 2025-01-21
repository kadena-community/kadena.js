import { setAliasesToAccounts } from '../setAliasesToAccounts';

describe('setAliasesToAccounts utils', () => {
  describe('setAliasesToAccounts', () => {
    const aliases: any[] = [
      {
        accountName: 'k:1',
        alias: 'he-man',
      },
      {
        accountName: 'k:2',
        alias: 'skeletor',
      },
      {
        accountName: 'k:4',
        alias: 'greyskull',
      },
      {
        accountName: 'k:5',
        alias: 'cringer',
      },
    ];

    it('should return an empty array, when the accounts array is empty', () => {
      const accounts: any[] = [];
      const aliases: any[] = [{ accountName: 'test' }];
      const result = setAliasesToAccounts(accounts, aliases);

      const expectedResult: any[] = [];

      expect(result).toEqual(expectedResult);
    });

    it('should return an array where the accounts have an alias, when available in the alias array', () => {
      const accounts: any[] = [
        {
          accountName: 'k:1',
        },
        {
          accountName: 'k:3',
        },
        {
          accountName: 'k:4',
        },
      ];

      const result = setAliasesToAccounts(accounts, aliases);

      const expectedResult: any[] = [
        {
          accountName: 'k:1',
          alias: 'he-man',
        },
        {
          accountName: 'k:3',
        },
        {
          accountName: 'k:4',
          alias: 'greyskull',
        },
      ];

      expect(result).toEqual(expectedResult);
    });
  });
});
