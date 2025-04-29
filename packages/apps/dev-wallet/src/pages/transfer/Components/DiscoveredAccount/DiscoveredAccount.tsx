import { Guard } from '@/Components/Guard/Guard';
import { KeySelector } from '@/Components/Guard/KeySelector';
import { Fungible } from '@/modules/account/account.repository';
import { IRetrievedAccount } from '@/modules/account/IRetrievedAccount';
import { MonoKey } from '@kadena/kode-icons/system';
import { Badge, Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';
import { needToSelectKeys } from '../../utils';
import { wrapperClass } from './style.css';

interface IProps {
  account: IRetrievedAccount;
  hideKeySelector?: boolean;
  contract: string;
  asset?: Fungible;
  onSelectHandle: (account?: IRetrievedAccount) => void;
}

export const DiscoveredAccount: FC<IProps> = ({
  account,
  hideKeySelector,
  onSelectHandle,
  asset,
  contract,
}) => {
  return (
    <Stack
      gap={'sm'}
      flexDirection="column"
      justifyContent={'space-between'}
      className={wrapperClass}
      width="100%"
    >
      <Stack gap={'sm'} alignItems={'center'}>
        <Stack flex={1} gap={'sm'} alignItems="center">
          <MonoKey width="16" height="16" />

          <Text size="smallest" bold>
            {account.alias}
          </Text>
          <Badge size="sm" style="info">
            {(account.guard as any).pred}
          </Badge>
        </Stack>
        <Stack gap={'xs'} alignItems="center">
          <Text variant='code' bold size="smallest">
            {account.overallBalance}
          </Text>
          <Text size="smallest">
            {`${asset?.symbol ?? contract}`}
          </Text>
        </Stack>
      </Stack>
      {!hideKeySelector && needToSelectKeys(account.guard) ? (
        <KeySelector
          guard={account.guard}
          selectedKeys={account.keysToSignWith ?? []}
          onSelect={(keys) => {
            onSelectHandle({
              ...account,
              keysToSignWith: keys,
            });
          }}
        />
      ) : (
        <Guard direction="column" hidePred guard={account.guard} />
      )}
    </Stack>
  );
};
