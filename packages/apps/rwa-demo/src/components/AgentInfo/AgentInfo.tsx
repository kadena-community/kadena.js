import type { IWalletAccount } from '@/providers/WalletProvider/WalletType';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  account: IRecord | IWalletAccount;
}

const getAccountName = (account: IProps['account']) => {
  if ('accountName' in account) return account.accountName;
  return account.address;
};

export const AgentInfo: FC<IProps> = ({ account }) => {
  const accountName = getAccountName(account);

  if (!account) return null;

  return (
    <Stack width="100%" flexDirection="column">
      <Heading as="h3">
        agent: {account.alias ? account.alias : accountName}
      </Heading>
    </Stack>
  );
};
