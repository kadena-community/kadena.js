import type { NetworkNames } from '@/constants/kadena';

export const getNetworks = (accounts: string[] = []): NetworkNames[] =>
  Array.from(
    new Set(
      accounts
        ?.map((account) => account.split(':')[1])
        ?.filter((network) => network !== 'development'),
    ),
  ) as NetworkNames[];

export const getAccounts = (
  accounts: string[] = [],
  selectedNetwork?: string,
): string[] =>
  Array.from(
    new Set(
      accounts
        ?.filter((account: string): boolean =>
          account.includes(`kadena:${selectedNetwork}`),
        )
        ?.map((account) => account.split(':')[2]),
    ),
  );
