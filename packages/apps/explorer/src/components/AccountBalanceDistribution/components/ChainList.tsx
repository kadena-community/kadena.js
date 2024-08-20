import type { AccountQuery } from '@/__generated__/sdk';
import type { IViewChain } from '@/utils/processChainAccounts';
import { Badge, Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import { ChainBalance } from './ChainBalance';

export type IChainAccounts = (
  | NonNullable<AccountQuery['fungibleAccount']>['chainAccounts'][0]
  | string
)[];

interface IProps extends PropsWithChildren {
  chains: IViewChain[];
}
export const ChainList: FC<IProps> = ({ chains }) => {
  const { low, high, value } = useMemo(() => {
    const low = chains[0].chainId;
    const high = chains[chains.length - 1].chainId;

    const value = chains.reduce((acc, val) => {
      return acc + (val.balance ?? 0);
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
          <ChainBalance key={`${idx}`} chain={chain} idx={chain.chainId} />
        ))}
      </Stack>
    </Stack>
  );
};
