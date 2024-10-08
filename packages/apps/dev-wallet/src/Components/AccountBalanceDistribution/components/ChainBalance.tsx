import { useWallet } from '@/modules/wallet/wallet.hook';
import { ChainId } from '@kadena/client';
import { Button, Stack, Text, TextField } from '@kadena/kode-ui';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IViewChain } from '../processChainAccounts';
import {
  chainBalanceWrapperClass,
  chainInputClass,
  chainTextBaseClass,
  chainTextDisabledClass,
  chainTextLargeClass,
  fundButtonClass,
  percentageValueVar,
} from './style.css';

interface IProps extends PropsWithChildren {
  chainAccount: IViewChain;
  chainId: string;
  fundAccount: (chainId: ChainId) => Promise<void>;
  editable?: boolean;
  onItemChange?: (key: string, value: any) => void;
}

export const ChainBalance: FC<IProps> = ({
  chainAccount,
  chainId,
  fundAccount,
  editable = true,
}) => {
  const { activeNetwork } = useWallet();
  const { register, getValues } = useFormContext();
  const disabledClass =
    editable || chainAccount.percentage ? '' : chainTextDisabledClass;
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
            [chainTextDisabledClass]: disabledClass,
          })}
        >
          Chain {chainId}
        </Text>
        {!editable &&
          ['testnet04', 'testnet05'].includes(
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

      {!editable && (
        <Stack
          justifyContent="flex-end"
          alignItems={'center'}
          className={classNames(chainTextBaseClass, {
            [disabledClass]: !chainAccount.percentage,
          })}
          gap="xs"
        >
          <Text
            variant="code"
            color="emphasize"
            className={chainTextLargeClass}
          >
            {!chainAccount.balance ? '-' : chainAccount.balance}
          </Text>
        </Stack>
      )}
      {editable && (
        <Stack justifyContent={'center'} alignItems={'center'}>
          <TextField
            size="sm"
            type="number"
            className={chainInputClass}
            {...register(`chains.${chainId}.balance` as const)}
            defaultValue={getValues(`chains.${chainId}.balance`)}
            value={getValues(`chains.${chainId}.balance`)}
          />
        </Stack>
      )}
    </Stack>
  );
};
