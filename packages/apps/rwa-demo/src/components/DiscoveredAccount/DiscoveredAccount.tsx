import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useGetInvestorBalance } from '@/hooks/getInvestorBalance';
import { useUser } from '@/hooks/user';
import type { IRetrievedAccount } from '@/services/discoverAccount';
import { MonoKey } from '@kadena/kode-icons';
import { Badge, maskValue, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import { wrapperClass } from './style.css';

interface IProps {
  account: IRetrievedAccount;
  asset?: IAsset;
}

export const DiscoveredAccount: FC<IProps> = ({
  account,

  asset,
}) => {
  const pred = (account.guard as any)?.pred;
  const { findAliasByAddress } = useUser();
  const displayName = findAliasByAddress(account?.address);
  const { data: balance, isPending } = useGetInvestorBalance({
    investorAccount: account.address,
  });

  const renderGuard = (guard: any) => {
    return (
      <Text variant="code" size="smallest">
        {maskValue(guard.principal)}
      </Text>
    );
  };

  return (
    <Stack
      gap={'sm'}
      flexDirection="column"
      justifyContent={'space-between'}
      className={wrapperClass}
      width="100%"
    >
      <>
        <Stack gap={'sm'} alignItems={'center'}>
          <Stack flex={1} gap={'sm'} alignItems="center">
            {pred ? (
              <>
                <MonoKey width="16" height="16" />

                <Text size="smallest" bold>
                  {displayName}
                </Text>

                <Badge size="sm" style="info">
                  {(account.guard as any).pred}
                </Badge>
              </>
            ) : (
              renderGuard(account.guard)
            )}
          </Stack>
        </Stack>

        <Stack
          flexWrap="wrap"
          flexDirection={'row'}
          gap="md"
          justifyContent={'space-between'}
          paddingInline={'sm'}
          marginBlock={'xs'}
        >
          {pred && renderGuard(account.guard)}

          {isPending ? (
            <TransactionPendingIcon />
          ) : (
            <Text variant="code" size="smallest">
              {balance} tkn
            </Text>
          )}
        </Stack>
      </>
    </Stack>
  );
};
