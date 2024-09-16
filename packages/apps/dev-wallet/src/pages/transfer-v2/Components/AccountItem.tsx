import { IAccount } from '@/modules/account/account.repository';
import { shorten } from '@/utils/helpers';
import { Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';
import { balanceClass } from './style.css';

export const AccountItem: FC<{ account: IAccount }> = ({ account }) => (
  <Stack
    flex={1}
    justifyContent={'space-between'}
    alignItems={'center'}
    paddingInlineEnd={'sm'}
  >
    <Text color="inherit" size="smallest">
      {shorten(account.address, 10)}
    </Text>

    <Text size="smallest" color="inherit" className={balanceClass}>
      Balance: {account.overallBalance}
    </Text>
  </Stack>
);
