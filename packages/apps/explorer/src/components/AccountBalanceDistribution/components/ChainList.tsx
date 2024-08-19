import type { AccountQuery } from '@/__generated__/sdk';
import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
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
  return (
    <Stack flex={1} flexDirection="column" width="100%" gap="sm">
      {chains.map((chain, idx) => (
        <ChainBalance
          key={`${idx}`}
          maxValue={maxValue}
          chain={chain}
          idx={typeof chain === 'string' ? chain : chain.chainId}
        />
      ))}
    </Stack>
  );
};
