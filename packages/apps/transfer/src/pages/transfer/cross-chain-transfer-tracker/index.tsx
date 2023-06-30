import {
  Button,
  Heading,
  SystemIcons,
  TextField,
} from '@kadena/react-components';

import {
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
  StyledInfoTitle,
} from '../cross-chain-transfer-finisher/styles';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { DetailCard } from '@/components/Global/DetailsCard';
import { useAppContext } from '@/context/app-context';
import { useDidUpdateEffect } from '@/hooks';
import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledInfoBox,
  StyledMainContent,
} from '@/pages/transfer/cross-chain-transfer-tracker/styles';
import {
  FromIconActive,
  ReceiverIconActive,
  ReceiverIconInactive,
} from '@/resources/svg/generated';
import {
  getTransferStatus,
  IStatusData,
} from '@/services/transfer-tracker/get-transfer-status';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';

const CrossChainTransferTracker: FC = () => {
  const { network } = useAppContext();
  const router = useRouter();

  const { t } = useTranslation('common');
  const [requestKey, setRequestKey] =
    useState<string>(router.query.reqKey as string) || '';
  const [data, setData] = useState<IStatusData>({});

  useDidUpdateEffect(() => {
    if (!router.isReady) {
      return;
    }
    const { reqKey } = router.query;
    if (reqKey) {
      setRequestKey(reqKey as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    setData({});
  }, [network]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    router.query.reqKey = requestKey;
    await router.push(router);

    try {
      await getTransferStatus({
        requestKey,
        network: network,
        t,
        options: {
          onPoll: (status: IStatusData) => {
            console.log(status);
            setData(status);
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout title={t('Track & trace transactions')}>
      <StyledMainContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledAccountForm>
            <Heading as="h5">Search Request</Heading>
            <TextField
              label={t('Request Key')}
              inputProps={{
                placeholder: t('Enter Request Key'),
                onChange: (e) =>
                  setRequestKey((e.target as HTMLInputElement).value),
                value: requestKey,
                leftPanel: SystemIcons.KeyIconFilled,
              }}
            />
          </StyledAccountForm>
          <StyledFormButton>
            <Button title={t('Search')}>
              {t('Search')}
              <SystemIcons.Magnify />
            </Button>
          </StyledFormButton>
        </StyledForm>

        {data.status ? (
          <StyledInfoBox>
            <StyledInfoTitle>{t('Transfer Information')}</StyledInfoTitle>

            {data.receiverAccount ? (
              <>
                <DetailCard
                  firstTitle={t('Sender')}
                  firstContent={data.senderAccount || ''}
                  secondTitle={t('Chain')}
                  secondContent={data.senderChain || ''}
                  icon={<FromIconActive />}
                />

                <StyledInfoItem>
                  <StyledInfoItemTitle>{t('Amount')}</StyledInfoItemTitle>
                  <StyledInfoItemLine>{` ${data.amount} ${t(
                    'KDA',
                  )}`}</StyledInfoItemLine>
                </StyledInfoItem>

                <StyledInfoItem>
                  <StyledInfoItemTitle>{t('Status')}</StyledInfoItemTitle>
                  <StyledInfoItemLine>{`${data.status} `}</StyledInfoItemLine>
                </StyledInfoItem>

                <StyledInfoItem>
                  <StyledInfoItemTitle>{t('Description')}</StyledInfoItemTitle>
                  <StyledInfoItemLine>{`${data.description} `}</StyledInfoItemLine>
                </StyledInfoItem>

                <DetailCard
                  firstTitle={t('Receiver')}
                  firstContent={data.receiverAccount || ''}
                  secondTitle={t('Chain')}
                  secondContent={data.receiverChain || ''}
                  icon={
                    data?.id === 3 ? (
                      <ReceiverIconActive />
                    ) : (
                      <ReceiverIconInactive />
                    )
                  }
                />
              </>
            ) : null}
          </StyledInfoBox>
        ) : null}
      </StyledMainContent>
    </MainLayout>
  );
};

export default CrossChainTransferTracker;
