import { Badge, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import type { IViewChain } from '../types';
import { ChainBalance } from './ChainBalance';

interface IProps {
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
        {chains.map((chainAccount, idx) => (
          <ChainBalance
            key={`${idx}`}
            chainAccount={chainAccount}
            idx={chainAccount.chainId}
          />
        ))}
      </Stack>
    </Stack>
  );
};
