import type { FormStatus } from '@/components/Global/FormStatusNotification';
import { FormStatusNotification } from '@/components/Global/FormStatusNotification';
import { Button, Stack, SystemIcon, Text } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useState } from 'react';
import TransactionDetails from './transaction-details';

import client from '@/constants/client';
import type { Network } from '@/constants/kadena';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { finishXChainTransfer } from '@/services/cross-chain-transfer-finish/finish-xchain-transfer';
import type { ISubmitTxResponseBody } from '@/services/transfer/submit-transaction';
import {
  listenResult,
  pollResult,
  submitTx,
} from '@/services/transfer/submit-transaction';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import type { ChainId, ITransactionDescriptor } from '@kadena/client';

import type { PactCommandObject } from '@ledgerhq/hw-app-kda';
import { buttonContainerClass } from './styles.css';

interface ISubmitTransactionProps {
  data: PactCommandObject | null;
  senderChainId?: ChainId;
  receiverChainId?: ChainId;
}

export const SubmitTransaction: FC<ISubmitTransactionProps> = ({
  data,
  senderChainId,
  receiverChainId,
}) => {
  const { t } = useTranslation('common');

  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });

  const { selectedNetwork: network, networksData } = useWalletConnectClient();
  const networkData: INetworkData = networksData.filter(
    (item) => (network as Network) === item.networkId,
  )[0];

  const [receiverRequestKey, setReceiverRequestKey] = useState<string>('');

  if (!data) {
    return null;
  }

  const onSubmit = async () => {
    const submitResponse = (await submitTx(
      [data],
      senderChainId!,
      network,
      networksData,
    )) as ITransactionDescriptor[];

    if (!submitResponse) {
      return setRequestStatus({
        status: 'erroneous',
        message: t('An error occurred.'),
      });
    }

    const pollResponse = (await pollResult(
      senderChainId!,
      network,
      networksData,
      submitResponse[0],
    )) as unknown as ISubmitTxResponseBody;

    const error = Object.values(pollResponse).find(
      (response) => response.result.status === 'failure',
    );
    if (error) {
      setRequestStatus({
        status: 'erroneous',
        message: error.response.error?.message || t('An error occurred.'),
      });
      return;
    }
    setRequestStatus({ status: 'successful' });

    if (receiverChainId !== senderChainId) {
      console.log('This is cross chain transfer - waiting for SPV proof');

      const apiHost = getApiHost({
        api: networkData.API,
        chainId: senderChainId!,
        networkId: network,
      });
      const { pollCreateSpv, listen } = client(apiHost);

      const requestObject = {
        requestKey: submitResponse[0].requestKey,
        networkId: network,
        chainId: senderChainId!,
      };

      const proof = await pollCreateSpv(requestObject, receiverChainId!);

      const status = await listen(requestObject);
      const pactId = status.continuation?.pactId ?? '';

      const requestKeyOrError = await finishXChainTransfer(
        {
          pactId,
          proof,
          rollback: false,
          step: 1,
        },
        receiverChainId!,
        network,
        networksData,
        850,
        'kadena-xchain-gas',
      );

      if (typeof requestKeyOrError !== 'string') {
        setRequestStatus({
          status: 'erroneous',
          message: error.response.error?.message || t('An error occurred.'),
        });
        return;
      }
      setReceiverRequestKey(requestKeyOrError as string);

      try {
        const pollResponseTarget = await listenResult(
          receiverChainId!,
          network,
          networksData,
          {
            requestKey: requestKeyOrError,
            networkId: network,
            chainId: receiverChainId!,
          },
        );

        if (pollResponseTarget.result.status === 'success') {
          return setRequestStatus({ status: 'successful' });
        }
        setRequestStatus({
          status: 'erroneous',
          message: t('An error occurred.'),
        });
      } catch (e) {
        setRequestStatus({
          status: 'erroneous',
          message: error.response.error?.message || t('An error occurred.'),
        });
        return;
      }
    }
  };

  return (
    <Stack flexDirection="column" gap="lg">
      <TransactionDetails transactions={{ cmds: [data] }} />
      <div className={buttonContainerClass}>
        <Button
          // isLoading={ledgerSignState.loading}
          // isDisabled={ledgerSignState.loading}
          endIcon={<SystemIcon.TrailingIcon />}
          title={t('Transfer')}
          onPress={onSubmit}
        >
          {t('Transfer')}
        </Button>
      </div>
      <FormStatusNotification
        status={requestStatus.status}
        statusBodies={{
          successful: t('The coins have been funded to the given account.'),
        }}
        body={requestStatus.message}
      />
      <Text>Target chain request key: {receiverRequestKey}</Text>
    </Stack>
  );
};
