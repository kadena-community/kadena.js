import type { FormStatus } from '@/components/Global/FormStatusNotification';
import { FormStatusNotification } from '@/components/Global/FormStatusNotification';
import { Button, Stack } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useState } from 'react';
import { SubmitTransactionDetails } from './submit-transaction-details';

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

import {
  infoNotificationColor,
  linkStyle,
  notificationLinkErrorStyle,
  notificationLinkStyle,
} from '@/pages/transactions/transfer/styles.css';
import { getExplorerLink } from '@/utils/getExplorerLink';
import {
  MonoContentCopy,
  MonoKeyboardArrowRight,
} from '@kadena/react-icons/system';
import type { PactCommandObject } from '@ledgerhq/hw-app-kda';
import Trans from 'next-translate/Trans';
import Link from 'next/link';

interface ISubmitTransactionProps {
  data: PactCommandObject | null;
  senderChainId: ChainId;
  receiverChainId: ChainId;
}

export const SubmitTransaction: FC<ISubmitTransactionProps> = ({
  data,
  senderChainId,
  receiverChainId,
}) => {
  const { t } = useTranslation('common');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });

  const { selectedNetwork: network, networksData } = useWalletConnectClient();
  const networkData: INetworkData = networksData.filter(
    (item) => (network as Network) === item.networkId,
  )[0];

  const [requestKey, setRequestKey] = useState<string>('');
  const [receiverRequestKey, setReceiverRequestKey] = useState<string>('');
  const onSameChain = senderChainId === receiverChainId;

  if (!data) {
    return null;
  }

  const onSubmit = async () => {
    setIsLoading(true);

    const submitResponse = (await submitTx(
      [data],
      senderChainId,
      network,
      networksData,
    )) as ITransactionDescriptor[];

    if (!submitResponse) {
      setIsLoading(false);
      return setRequestStatus({
        status: 'erroneous',
        message: t('An error occurred.'),
      });
    }

    setRequestKey(submitResponse[0].requestKey);

    const pollResponse = (await pollResult(
      senderChainId,
      network,
      networksData,
      submitResponse[0],
    )) as unknown as ISubmitTxResponseBody;

    const error = Object.values(pollResponse).find(
      (response) => response.result.status === 'failure',
    );
    if (error) {
      setIsLoading(false);
      setRequestStatus({
        status: 'erroneous',
        message: error.response.error?.message || t('An error occurred.'),
      });
      return;
    }

    if (!onSameChain) {
      console.log('This is cross chain transfer - waiting for SPV proof');

      const apiHost = getApiHost({
        api: networkData.API,
        chainId: senderChainId,
        networkId: network,
      });
      const { pollCreateSpv, listen } = client(apiHost);

      const requestObject = {
        requestKey: submitResponse[0].requestKey,
        networkId: network,
        chainId: senderChainId,
      };

      const proof = await pollCreateSpv(requestObject, receiverChainId);

      const status = await listen(requestObject);
      const pactId = status.continuation?.pactId ?? '';

      const requestKeyOrError = await finishXChainTransfer(
        {
          pactId,
          proof,
          rollback: false,
          step: 1,
        },
        receiverChainId,
        network,
        networksData,
        850,
        'kadena-xchain-gas',
      );

      if (typeof requestKeyOrError !== 'string') {
        setIsLoading(false);
        setRequestStatus({
          status: 'erroneous',
          message: requestKeyOrError.error || t('An error occurred.'),
        });
        return;
      }
      setReceiverRequestKey(requestKeyOrError);

      try {
        const pollResponseTarget = await listenResult(
          receiverChainId,
          network,
          networksData,
          {
            requestKey: requestKeyOrError,
            networkId: network,
            chainId: receiverChainId,
          },
        );

        setIsLoading(false);

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
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(false);
    return setRequestStatus({ status: 'successful' });
  };

  const linkToExplorer = `${getExplorerLink(
    requestKey,
    network,
    networksData,
  )}`;

  const linkToTracker = `/transactions/cross-chain-transfer-tracker?reqKey=${requestKey}`;

  const linkToFinisher = `/transactions/cross-chain-transfer-finisher?reqKey=${receiverRequestKey}`;

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  const completeLinkToFinisher = `${origin}/transactions/cross-chain-transfer-finisher?reqKey=${receiverRequestKey}`;

  return (
    <Stack flexDirection="column" gap="lg">
      <SubmitTransactionDetails transactions={{ cmds: [data] }} />

      {requestKey !== '' ? (
        <FormStatusNotification
          status={'processing'}
          title={t('Transaction submitted')}
        >
          <Stack flexDirection={'row'} alignItems={'center'}>
            <Trans
              i18nKey="common:link-to-kadena-explorer"
              components={[
                <Link
                  className={linkStyle}
                  href={linkToExplorer}
                  target={'_blank'}
                  key={requestKey}
                >
                  {requestKey}
                </Link>,
              ]}
            />
            <Button
              color="primary"
              icon={<MonoContentCopy />}
              onPress={async () => {
                await navigator.clipboard.writeText(requestKey);
              }}
              title={t('copy request Key')}
              aria-label={t('copy request Key')}
              variant="text"
            />
          </Stack>

          {!onSameChain ? (
            <>
              <Trans
                i18nKey="common:link-to-tracker"
                components={[
                  <Link
                    className={linkStyle}
                    href={linkToTracker}
                    target={'_blank'}
                    key={requestKey}
                  />,
                ]}
              />
              <Stack flexDirection={'column'} marginBlockStart={'xl'}>
                <div className={infoNotificationColor}>
                  {t('cross-chain-transfer-initiated')}
                </div>

                <Trans i18nKey="common:cross-chain-warning" />
              </Stack>
            </>
          ) : null}
        </FormStatusNotification>
      ) : null}
      <FormStatusNotification
        status={requestStatus.status}
        statusBodies={{
          successful: t('The coins have been funded to the given account.'),
        }}
      >
        <Stack flexDirection={'column'} marginBlockStart={'md'}>
          {requestStatus.message}

          {!onSameChain && requestStatus.status === 'erroneous' ? (
            <Stack gap={'sm'} alignItems={'center'}>
              <Trans
                i18nKey="common:link-to-finisher"
                components={[
                  <Link
                    className={notificationLinkStyle}
                    href={linkToFinisher}
                    target={'_self'}
                    key={linkToFinisher}
                  />,
                ]}
              />

              <Button
                color="primary"
                icon={
                  <MonoContentCopy className={notificationLinkErrorStyle} />
                }
                onPress={async () => {
                  await navigator.clipboard.writeText(completeLinkToFinisher);
                }}
                title={t('copy link to finisher')}
                aria-label={t('copy link to finisher')}
                variant="text"
              />
            </Stack>
          ) : null}
        </Stack>
      </FormStatusNotification>

      <Stack justifyContent={'flex-end'} gap={'lg'}>
        <Button
          isLoading={isLoading}
          // isDisabled={ledgerSignState.loading}
          endIcon={<MonoKeyboardArrowRight />}
          title={t('Transfer')}
          onPress={onSubmit}
        >
          {t('Transfer')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SubmitTransaction;
