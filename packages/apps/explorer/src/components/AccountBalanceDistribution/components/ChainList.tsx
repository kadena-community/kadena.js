import type { AccountQuery } from '@/__generated__/sdk';
import { Badge, Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import { ChainBalance } from './ChainBalance';

export type IChainAccounts = (
  | NonNullable<AccountQuery['fungibleAccount']>['chainAccounts'][0]
  | string
)[];

interface IProps extends PropsWithChildren {
  chains: IChainAccounts;
  maxValue: number;
}
export const ChainList: FC<IProps> = ({ chains, maxValue }) => {
  const { low, high, value } = useMemo(() => {
    const low = typeof chains[0] === 'string' ? chains[0] : chains[0].chainId;
    const lastChain = chains[chains.length - 1];
    const high = typeof lastChain === 'string' ? lastChain : lastChain.chainId;

    const value = chains.reduce((acc, val) => {
      if (typeof val === 'string') return acc;
      return acc + val.balance;
    }, 0);

    return { high, low, value };
  }, [chains]);
  return (
    <Stack flex={1} flexDirection="column" width="100%" gap="sm">
      <Stack gap="xs">
        <Badge style="highContrast">{`Chains ${low} - ${high}`}</Badge>
        <Badge>{`${value} KDA`}</Badge>
      </Stack>

      <Stack
        as="ul"
        flexDirection="column"
        width="100%"
        gap="sm"
        marginInline="no"
        paddingInline="no"
      >
        {chains.map((chain, idx) => (
          <ChainBalance
            key={`${idx}`}
            maxValue={maxValue}
            chain={chain}
            idx={typeof chain === 'string' ? chain : chain.chainId}
          />
        ))}
      </Stack>
    </Stack>
  );
};
