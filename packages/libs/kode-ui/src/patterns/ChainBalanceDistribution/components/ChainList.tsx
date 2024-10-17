import type { FC } from 'react';
import React, { useMemo } from 'react';
import type { IChainBalanceProps } from '../types';
import { Badge, Stack } from './../../../components';
import { ChainBalance } from './ChainBalance';

interface IProps {
  chains: IChainBalanceProps[];
}
export const ChainList: FC<IProps> = ({ chains }) => {
  const { low, high, value } = useMemo(() => {
    if (!chains.length) {
      return {
        high: 0,
        low: 0,
        value: 0,
      };
    }
    const low = chains[0].chainId;
    const high = chains[chains.length - 1].chainId;

    const value = chains.reduce((acc, val) => {
      return acc + (val.balance ?? 0);
    }, 0);

    return { high, low, value };
  }, [chains]);

  console.log({ chains });
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
        {chains.map((chainAccount) => (
          <ChainBalance
            key={`${chainAccount.chainId}`}
            chainAccount={chainAccount}
            idx={chainAccount.chainId}
          />
        ))}
      </Stack>
    </Stack>
  );
};
