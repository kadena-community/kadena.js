import { Stack, Text } from '@kadena/kode-ui';
import { assignInlineVars } from '@vanilla-extract/dynamic';

import { chainBalancePercentage } from '@/utils/chainBalancePercentage';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import type { IChainAccounts } from './ChainList';
import {
  chainBalanceWrapperClass,
  chainTextBaseClass,
  chainTextDisabledClass,
  chainTextLargeClass,
  chainTextSubtleClass,
  percentageValueVar,
} from './style.css';

interface IProps extends PropsWithChildren {
  maxValue: number;
  chain: IChainAccounts[0];
  idx: string;
}

export const ChainBalance: FC<IProps> = ({ maxValue, chain, idx }) => {
  const percentageValue = useMemo(() => {
    return chainBalancePercentage(chain, maxValue);
  }, [maxValue, chain]);
  return (
    <Stack
      as="li"
      width="100%"
      justifyContent="space-between"
      className={chainBalanceWrapperClass}
      style={{
        ...assignInlineVars({
          [percentageValueVar]: `${percentageValue}%`,
        }),
      }}
    >
      <Stack
        justifyContent="flex-start"
        className={classNames(chainTextBaseClass, {
          [chainTextDisabledClass]: typeof chain === 'string',
        })}
      >
        <Text>Chain {idx}</Text>
      </Stack>

      <Stack
        justifyContent="flex-end"
        className={classNames(chainTextBaseClass, {
          [chainTextDisabledClass]: typeof chain === 'string',
        })}
        gap="xs"
      >
        <Text variant="code" color="emphasize" className={chainTextLargeClass}>
          {typeof chain === 'string' ? '-' : chain.balance}
        </Text>
        <Text variant="ui" bold className={chainTextSubtleClass}>
          {' '}
          KDA
        </Text>
      </Stack>
    </Stack>
  );
};
