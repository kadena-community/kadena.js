import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { Button, TextField } from '@kadena/react-components';

import {
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
  StyledInfoTitle,
} from '../cross-chain-transfer-finisher/styles';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { SidebarMenu } from '@/components/Global';
import { kadenaConstants } from '@/constants/kadena';
import { useAppContext } from '@/context/app-context';
import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledInfoBox,
  StyledMainContent,
} from '@/pages/transfer/cross-chain-transfer-tracker/styles';
import {
  getTransferStatus,
  StatusData,
} from '@/services/cross-chain-transfer-tracker/get-transfer-status';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';
import FormStatusNotification from './notification';

export type RequestStatus = 'not started' | 'pending' | 'succeeded' | 'failed';

const CrossChainTransferTracker: FC = () => {
  const { network } = useAppContext();

  const chainNetwork: {
    Mainnet: { server: string; network: string };
    Testnet: { server: string; network: string };
  } = {
    Mainnet: {
      server: kadenaConstants.MAINNET.API,
      network: kadenaConstants.MAINNET.NETWORKS.MAINNET01,
    },
    Testnet: {
      server: kadenaConstants.TESTNET.API,
      network: kadenaConstants.TESTNET.NETWORKS.TESTNET04,
    },
  };

  const { t } = useTranslation('common');
  const [requestKey, setRequestKey] = useState<string>('');
  const [data, setData] = useState<StatusData>({});
  const [requestStatus, setRequestStatus] = useState<{
    status: RequestStatus;
    message?: string;
  }>({ status: 'not started' });
  const router = useRouter();

  useEffect(() => {
    const { reqKey } = router.query;
    if (reqKey) {
      setRequestKey(reqKey as string);
    }
  }, [router.query]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    router.query.reqKey = requestKey;
    await router.push(router);

    try {
      await getTransferStatus({
        requestKey,
        server: chainNetwork[network].server,
        networkId: chainNetwork[network].network as ChainwebNetworkId,
        t,
        options: {
          onPoll: (status) => {
            setRequestStatus({ status: 'pending' });
            setData(status);
          },
        },
      });
      setRequestStatus({ status: 'succeeded' });
    } catch (error) {
      setRequestStatus({ status: 'failed', message: error.message });
    }
  };

  return (
    <MainLayout title={t('Kadena Cross Chain Transfer Finisher')}>
      <StyledMainContent>
        <StyledForm onSubmit={handleSubmit}>
          <FormStatusNotification
            status={requestStatus.status}
            body={requestStatus.message}
          />
          <StyledAccountForm>
            <TextField
              label={t('Request Key')}
              inputProps={{
                placeholder: t('Enter Request Key'),
                onChange: (e) =>
                  setRequestKey((e.target as HTMLInputElement).value),
                value: requestKey,
              }}
            />
          </StyledAccountForm>
          <StyledFormButton>
            <Button title={t('Track Transfer')}>{t('Track Transfer')}</Button>
          </StyledFormButton>
        </StyledForm>

        {data.status ? (
          <StyledInfoBox>
            <StyledInfoTitle>{t('Transfer Information')}</StyledInfoTitle>

            {data.receiverAccount ? (
              <>
                <StyledInfoItem>
                  <StyledInfoItemTitle>{t('Sender')}</StyledInfoItemTitle>
                  <StyledInfoItemLine>{`Chain: ${data.senderChain}`}</StyledInfoItemLine>
                  <StyledInfoItemLine>{`Account: ${data.senderAccount}`}</StyledInfoItemLine>
                </StyledInfoItem>
                <StyledInfoItem>
                  <StyledInfoItemTitle>{t('Receiver')}</StyledInfoItemTitle>
                  <StyledInfoItemLine>{`Chain: ${data.receiverChain}`}</StyledInfoItemLine>
                  <StyledInfoItemLine>{`Account: ${data.receiverAccount}`}</StyledInfoItemLine>
                </StyledInfoItem>

                <StyledInfoItem>
                  <StyledInfoItemTitle>{t('Amount')}</StyledInfoItemTitle>
                  <StyledInfoItemLine>{` ${data.amount} ${t(
                    'KDA',
                  )}`}</StyledInfoItemLine>
                </StyledInfoItem>
              </>
            ) : null}

            <StyledInfoItem>
              <StyledInfoItemTitle>{t('Status')}</StyledInfoItemTitle>
              <StyledInfoItemLine>{`${data.status} `}</StyledInfoItemLine>
            </StyledInfoItem>

            <StyledInfoItem>
              <StyledInfoItemTitle>{t('Description')}</StyledInfoItemTitle>
              <StyledInfoItemLine>{`${data.description} `}</StyledInfoItemLine>
            </StyledInfoItem>
          </StyledInfoBox>
        ) : null}
      </StyledMainContent>
    </MainLayout>
  );
};

export default CrossChainTransferTracker;
