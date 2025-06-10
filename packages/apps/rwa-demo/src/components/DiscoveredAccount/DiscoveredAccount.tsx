import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useNetwork } from '@/hooks/networks';
import { useUser } from '@/hooks/user';
import type { IAddAgentProps } from '@/services/addAgent';
import type { IRetrievedAccount } from '@/services/discoverAccount';
import { discoverAccount } from '@/services/discoverAccount';
import { MonoKey } from '@kadena/kode-icons';
import { Badge, maskValue, Notification, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { UseFormSetError } from 'react-hook-form';
import { InvestorBalance } from '../InvestorBalance/InvestorBalance';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import { wrapperClass } from './style.css';

interface IProps {
  accountAddress: string;
  asset?: IAsset;
  setError?: UseFormSetError<IAddAgentProps>;
}

export const DiscoveredAccount: FC<IProps> = ({
  accountAddress,
  setError,
  asset,
}) => {
  const [account, setAccount] = useState<IRetrievedAccount | null>(null);
  const { activeNetwork } = useNetwork();
  const [isPending, setIsPending] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { findAliasByAddress } = useUser();

  useEffect(() => {
    const loadAccount = async () => {
      if (!accountAddress.startsWith('k:') || accountAddress.length !== 66)
        return;
      setIsPending(true);

      const [res] = await discoverAccount(accountAddress, activeNetwork);

      setIsPending(false);

      if (!res) {
        setNotFound(true);
        if (setError) {
          setError('accountName', {
            type: 'manual',
            message: 'The account you entered does not exist on the network.',
          });
        }
      }
      setAccount(res);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAccount();
  }, [accountAddress, activeNetwork.networkId]);

  const pred = (account?.guard as any)?.pred;
  const displayName = findAliasByAddress(accountAddress);

  const renderGuard = (guard: any) => {
    return (
      <Text variant="code" size="smallest">
        {maskValue(guard.principal)}
      </Text>
    );
  };

  if (isPending)
    return (
      <Stack gap={'sm'} alignItems="center" width="100%">
        <TransactionPendingIcon />
      </Stack>
    );

  if (notFound && !!accountAddress?.length)
    return (
      <Notification intent="negative" role="status" type="inlineStacked">
        The account you entered does not exist on the network.
      </Notification>
    );

  if (!account || !activeNetwork) return null;

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

          <Text variant="code" size="smallest">
            <InvestorBalance investorAccount={account.address} short />
          </Text>
        </Stack>
      </>
    </Stack>
  );
};
