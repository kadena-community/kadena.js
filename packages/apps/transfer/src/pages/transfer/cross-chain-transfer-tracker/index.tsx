import {
  Button,
  Heading,
  InputWrapperStatus,
  ProductIcon,
  SystemIcon,
  TextField,
  TrackerCard,
} from '@kadena/react-ui';

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
import { validateRequestKey } from '@/services/utils/utils';
import Debug from 'debug';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';

const CrossChainTransferTracker: FC = () => {
  const { network } = useAppContext();
  const router = useRouter();

  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-tracker',
  );
  const { t } = useTranslation('common');
  const [requestKey, setRequestKey] = useState<string>(
    (router.query?.reqKey as string) || '',
  );
  const [data, setData] = useState<IStatusData>({});
  const [validRequestKey, setValidRequestKey] = useState<
    InputWrapperStatus | undefined
  >();
  const [txError, setTxError] = useState<string>('');

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

  const checkRequestKey = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    e.preventDefault();
    debug(checkRequestKey.name);

    //Clear error message when user starts typing
    setTxError('');

    if (!requestKey) {
      setValidRequestKey(undefined);
      return;
    }

    if (validateRequestKey(requestKey) === undefined) {
      setValidRequestKey('negative');
      return;
    }
    setValidRequestKey(undefined);
    return;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    debug(handleSubmit);

    router.query.reqKey = requestKey;
    await router.push(router);

    try {
      await getTransferStatus({
        requestKey,
        network: network,
        t,
        options: {
          onPoll: (status: IStatusData) => {
            setData(status);
            if (status.status === 'Error' && status.description) {
              //Set error message
              setTxError(status.description);
            }
          },
        },
      });
    } catch (error) {
      debug(error);
    }
  };

  const onRequestKeyChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setRequestKey(e.target.value);
    },
    [],
  );

  return (
    <MainLayout title={t('Track & trace transactions')}>
      <StyledMainContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledAccountForm>
            <Heading as="h5">Search Request</Heading>
            <TextField
              label={t('Request Key')}
              status={validRequestKey}
              // Only set helper text if there is no receiver account otherwise message will be displayed on side bar
              helperText={!data.receiverAccount ? txError : undefined}
              inputProps={{
                id: 'request-key-input',
                placeholder: t('Enter Request Key'),
                onChange: onRequestKeyChange,
                onKeyUp: checkRequestKey,
                value: requestKey,
                leftIcon: SystemIcon.KeyIconFilled,
              }}
            />
          </StyledAccountForm>
          <StyledFormButton>
            <Button.Root title={t('Search')}>
              {t('Search')}
              <SystemIcon.Magnify />
            </Button.Root>
          </StyledFormButton>
        </StyledForm>

        {data.receiverAccount ? (
          <StyledInfoBox>
            <StyledInfoTitle>{t('Transfer Information')}</StyledInfoTitle>
            <TrackerCard
              variant="vertical"
              icon={ProductIcon.QuickStart}
              labelValue={[
                {
                  label: t('Sender'),
                  value: data.senderAccount || '',
                  isAccount: true,
                },
                {
                  label: t('Chain'),
                  value: data.senderChain || '',
                },
              ]}
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

            <TrackerCard
              variant="vertical"
              icon={
                data?.id === 3
                  ? ProductIcon.Receiver
                  : ProductIcon.ReceiverInactive
              }
              labelValue={[
                {
                  label: t('Receiver'),
                  value: data.receiverAccount || '',
                  isAccount: true,
                },
                {
                  label: t('Chain'),
                  value: data.receiverChain || '',
                },
              ]}
            />
          </StyledInfoBox>
        ) : null}
      </StyledMainContent>
    </MainLayout>
  );
};

export default CrossChainTransferTracker;
