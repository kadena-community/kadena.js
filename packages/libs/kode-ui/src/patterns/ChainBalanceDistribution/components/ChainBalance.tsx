import { assignInlineVars } from '@vanilla-extract/dynamic';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import type { IChainBalanceProps } from '../types';
import { Stack, Text } from './../../../components';
import {
  chainBalanceWrapperClass,
  chainTextBaseClass,
  chainTextDisabledClass,
  chainTextLargeClass,
  chainTextSubtleClass,
  percentageValueVar,
} from './style.css';

interface IProps {
  chainAccount: IChainBalanceProps;
  idx: string;
}

export const ChainBalance: FC<IProps> = ({ chainAccount, idx }) => {
  console.log(chainAccount.percentage);
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
