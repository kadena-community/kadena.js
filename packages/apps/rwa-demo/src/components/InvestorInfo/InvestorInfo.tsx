import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { useFreeze } from '@/hooks/freeze';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { InvestorBalance } from '../InvestorBalance/InvestorBalance';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';

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
      <Heading as="h3">
        investor: {account.alias ? account.alias : accountName}
      </Heading>
      <Stack width="100%" alignItems="center" gap="md">
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
