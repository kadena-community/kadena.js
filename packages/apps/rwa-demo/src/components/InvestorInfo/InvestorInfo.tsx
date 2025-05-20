import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useFreeze } from '@/hooks/freeze';
import type { IWalletAccount } from '@/providers/WalletProvider/WalletType';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button, MaskedValue, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { InvestorBalance } from '../InvestorBalance/InvestorBalance';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';

interface IProps {
  account: IRecord | IWalletAccount;
}

const getAccountName = (account: IProps['account']) => {
  if ('accountName' in account) return account.accountName;
  return account.address;
};

export const InvestorInfo: FC<IProps> = ({ account }) => {
  const accountName = getAccountName(account);
  const { frozen } = useFreeze({ investorAccount: accountName });

  if (!account) return null;
  return (
    <Stack width="100%" flexDirection="column">
      <Text>
        {account.alias
          ? account.alias
          : accountName && <MaskedValue value={accountName} />}
      </Text>

      <Stack
        width="100%"
        alignItems="flex-start"
        gap="md"
        flexDirection="column"
      >
        <Button isDisabled>
          <TransactionTypeSpinner
            type={TXTYPES.FREEZEINVESTOR}
            account={accountName}
            fallbackIcon={
              frozen ? (
                <Stack gap="sm" alignItems="center">
                  <MonoPause />
                  frozen
                </Stack>
              ) : (
                <Stack gap="sm" alignItems="center">
                  <MonoPlayArrow />
                  active
                </Stack>
              )
            }
          />
        </Button>

        <InvestorBalance investorAccount={accountName} />
      </Stack>
    </Stack>
  );
};
