import type { IViewChain } from '@/utils/processChainAccounts';
import { Stack, Text } from '@kadena/kode-ui';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import {
  chainBalanceWrapperClass,
  chainTextBaseClass,
  chainTextDisabledClass,
  chainTextLargeClass,
  chainTextSubtleClass,
  percentageValueVar,
} from './style.css';

interface IProps extends PropsWithChildren {
  chainAccount: IViewChain;
  idx: string;
}

export const ChainBalance: FC<IProps> = ({ chainAccount, idx }) => {
  return (
    <Stack
      as="li"
      width="100%"
      justifyContent="space-between"
      className={chainBalanceWrapperClass}
      style={{
        ...assignInlineVars({
          [percentageValueVar]: `${chainAccount.percentage}%`,
        }),
      }}
    >
      <Stack
        justifyContent="flex-start"
        className={classNames(chainTextBaseClass, {
          [chainTextDisabledClass]: !chainAccount.percentage,
        })}
      >
        <Text>Chain {idx}</Text>
      </Stack>

      <Stack
        justifyContent="flex-end"
        className={classNames(chainTextBaseClass, {
          [chainTextDisabledClass]: !chainAccount.percentage,
        })}
        gap="xs"
      >
        <Text variant="code" color="emphasize" className={chainTextLargeClass}>
          {!chainAccount.balance ? '-' : chainAccount.balance}
        </Text>
        <Text variant="ui" bold className={chainTextSubtleClass}>
          {' '}
          KDA
        </Text>
      </Stack>
    </Stack>
  );
};
