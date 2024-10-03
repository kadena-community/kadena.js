import { useWallet } from '@/modules/wallet/wallet.hook';
import { ChainId } from '@kadena/client';
import { Button, Stack, Text } from '@kadena/kode-ui';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import { IViewChain } from '../processChainAccounts';
import {
  chainBalanceWrapperClass,
  chainTextBaseClass,
  chainTextDisabledClass,
  chainTextLargeClass,
  chainTextSubtleClass,
  fundButtonClass,
  percentageValueVar,
} from './style.css';

interface IProps extends PropsWithChildren {
  chainAccount: IViewChain;
  chainId: string;
  fundAccount: (chainId: ChainId) => Promise<void>;
}

export const ChainBalance: FC<IProps> = ({
  chainAccount,
  chainId,
  fundAccount,
}) => {
  const { activeNetwork } = useWallet();
  return (
    <Stack
      as="li"
      width="100%"
      justifyContent="space-between"
      className={chainBalanceWrapperClass}
      alignItems={'center'}
      style={{
        ...assignInlineVars({
          [percentageValueVar]: `${chainAccount.percentage}%`,
        }),
      }}
    >
      <Stack
        justifyContent="flex-start"
        alignItems={'center'}
        gap={'md'}
        className={classNames(chainTextBaseClass)}
      >
        <Text
          className={classNames({
            [chainTextDisabledClass]: !chainAccount.percentage,
          })}
        >
          Chain {chainId}
        </Text>
        {['testnet04', 'testnet05'].includes(
          activeNetwork?.networkId ?? '',
        ) && (
          <Button
            isCompact
            variant={chainAccount.balance ? 'primary' : 'transparent'}
            className={fundButtonClass}
            onPress={() => fundAccount(chainId as ChainId)}
          >
            Fund on Testnet
          </Button>
        )}
      </Stack>

      <Stack
        justifyContent="flex-end"
        alignItems={'center'}
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
