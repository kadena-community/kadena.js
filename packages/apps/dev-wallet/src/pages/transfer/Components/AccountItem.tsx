import { IGuard, IOwnedAccount } from '@/modules/account/account.repository';
import { formatList, shorten } from '@/utils/helpers';
import { MonoLink } from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';
import { Guard } from '../../../Components/Guard/Guard';
import { balanceClass } from './style.css';
export const AccountItem: FC<{
  account: Pick<IOwnedAccount, 'alias' | 'address' | 'overallBalance'>;
  chains?: IOwnedAccount['chains'];
  guard?: IGuard;
}> = ({ guard, account, chains }) => (
  <Stack flex={1} alignItems="flex-start" paddingInlineEnd={'sm'}>
    <Stack gap={'sm'} alignItems="flex-start">
      <Stack flexDirection="column" gap="xs" style={{ width: '150px' }}>
        {account.alias && <Text size="smallest">{account.alias}</Text>}
        <Text size="smallest" variant="code">
          {shorten(account.address, 10)}
        </Text>
      </Stack>
      {chains && chains.length > 0 && (
        <Text size="smallest">
          <Stack gap={'xxs'} alignItems="flex-start">
            <MonoLink />({formatList(chains.map(({ chainId }) => +chainId))})
          </Stack>
        </Text>
      )}
    </Stack>
    <Stack gap={'sm'} alignItems="flex-start" flex={1}>
      {guard && <Guard guard={guard} />}
      <Stack flexDirection="column">
        <Text size="smallest" bold className={balanceClass}>
          Balance:
        </Text>
        <Text size="smallest" variant="code" className={balanceClass}>
          {account.overallBalance}
        </Text>
      </Stack>
    </Stack>
  </Stack>
);
