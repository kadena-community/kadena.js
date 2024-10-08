import { Chain } from '@/Components/Badge/Badge';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Transaction } from '@/pages/transaction/Transaction';
import { ISigner } from '@kadena/client';
import { Box, Button, Notification, Stack } from '@kadena/kode-ui';
import { useCallback, useState } from 'react';
import { createRedistributionTxs } from '../utils';
import { Redistribution, Transfer } from './TransferForm';

export function RedistributionPage({
  redistribution,
  formData,
}: {
  redistribution: Redistribution[];
  formData: Required<Transfer>;
}) {
  const { fungibles, activeNetwork, getPublicKeyData } = useWallet();
  const [redistributionGroupId, setRedistributionGroupId] = useState<string>();

  const mapKeys = useCallback(
    (key: ISigner) => {
      if (typeof key === 'object') return key;
      const info = getPublicKeyData(key);
      if (info && info.scheme) {
        return {
          pubKey: key,
          scheme: info.scheme,
        };
      }
      if (key.startsWith('WEBAUTHN')) {
        return {
          pubKey: key,
          scheme: 'WebAuthn' as const,
        };
      }
      return key;
    },
    [getPublicKeyData],
  );

  async function doRedistribution() {
    if (redistribution.length > 0) {
      if (!formData.senderAccount || !formData.senderAccount.keyset) return;
      const [gid, txs] = await createRedistributionTxs({
        account: formData.senderAccount,
        redistribution,
        gasLimit: +formData.gasLimit,
        gasPrice: +formData.gasPrice,
        networkId: activeNetwork?.networkId ?? 'mainnet01',
        mapKeys,
      });
      if (txs.length > 0) {
        setRedistributionGroupId(gid);
      }
    }
  }

  return (
    <Stack flexDirection={'column'}>
      {redistributionGroupId ? (
        <Transaction groupId={redistributionGroupId} />
      ) : (
        <Notification role="alert" intent="info">
          <Stack flexDirection={'column'} gap={'sm'}>
            Before proceeding with the transfer, the following redistribution
            should happen:
            <Box>{formData.senderAccount.address}</Box>
            <Stack flexDirection={'column'} gap={'sm'}>
              {redistribution.map((r) => (
                <Stack
                  key={r.source + r.target}
                  gap={'sm'}
                  alignItems={'center'}
                >
                  {'From '}
                  <Chain chainId={r.source} />
                  {'to '}
                  <Chain chainId={r.target} />
                  {r.amount}{' '}
                  {fungibles.find((ct) => ct.contract === formData.fungible)
                    ?.symbol ?? formData.fungible}
                </Stack>
              ))}
            </Stack>
            <Stack marginBlockStart={'lg'}>
              <Button onClick={doRedistribution}>Redistribute</Button>
            </Stack>
          </Stack>
        </Notification>
      )}
    </Stack>
  );
}
