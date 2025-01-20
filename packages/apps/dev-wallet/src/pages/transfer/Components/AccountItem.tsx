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
  <Stack
    flex={1}
    justifyContent={'space-between'}
    alignItems={'center'}
    paddingInlineEnd={'sm'}
  >
    <Stack gap={'sm'}>
      <Text size="smallest">
        {account.alias
          ? `${account.alias} (${shorten(account.address, 10)})`
          : shorten(account.address, 10)}
      </Text>
      {chains && chains.length > 0 && (
        <Text size="smallest">
          <Stack gap={'xxs'} alignItems={'center'}>
            <MonoLink />({formatList(chains.map(({ chainId }) => +chainId))})
          </Stack>
        </Text>
      )}
    </Stack>
    <Stack gap={'sm'} alignItems={'center'}>
      {guard && <Guard guard={guard} />}
      <Text size="smallest" className={balanceClass}>
        Balance: {account.overallBalance}
      </Text>
    </Stack>
  </Stack>
);
