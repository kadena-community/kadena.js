import {
  Breadcrumbs,
  Button,
  Heading,
  ProductIcon,
  SystemIcon,
  TrackerCard,
} from '@kadena/react-ui';

import {
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
  StyledInfoTitle,
} from '../cross-chain-transfer-finisher/styles';

import RequestKeyField, {
  REQUEST_KEY_VALIDATION,
} from '@/components/Global/RequestKeyField';
import Routes from '@/constants/routes';
import { useAppContext } from '@/context/app-context';
import { useToolbar } from '@/context/layout-context';
import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledInfoBox,
  StyledMainContent,
} from '@/pages/transactions/cross-chain-transfer-tracker/styles';
import {
  getTransferStatus,
  IStatusData,
  StatusId,
} from '@/services/transfer-tracker/get-transfer-status';
import { zodResolver } from '@hookform/resolvers/zod';
import Debug from 'debug';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
  requestKey: REQUEST_KEY_VALIDATION,
});

type FormData = z.infer<typeof schema>;

const CrossChainTransferTracker: FC = () => {
  const { network } = useAppContext();
  const router = useRouter();
  const { t } = useTranslation('common');

  useToolbar([
    {
      title: t('Cross Chain'),
      icon: SystemIcon.Transition,
      href: Routes.CROSS_CHAIN_TRANSFER_TRACKER,
    },
    {
      title: t('Finalize Cross Chain'),
      icon: SystemIcon.TransitionMasked,
      href: Routes.CROSS_CHAIN_TRANSFER_FINISHER,
    },
    {
      title: t('Module Explorer'),
      icon: SystemIcon.Earth,
      href: Routes.MODULE_EXPLORER,
    },
  ]);

  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-tracker',
  );
  const [data, setData] = useState<IStatusData>({});
  const [txError, setTxError] = useState<string>('');

  useEffect(() => {
    setData({});
  }, [network]);

  const checkRequestKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    debug(checkRequestKey.name);

    //Clear error message when user starts typing
    setTxError('');
  };

  const handleSubmit = async (data: FormData): Promise<void> => {
    debug(handleSubmit);

    router.query.reqKey = data.requestKey;
    await router.push(router);

    try {
      await getTransferStatus({
        requestKey: data.requestKey,
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

  const {
    register,
    handleSubmit: validateThenSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: { requestKey: router.query.reqKey as string },
    // @see https://www.react-hook-form.com/faqs/#Howtoinitializeformvalues
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  const showInputError = txError === '' ? undefined : 'negative';
  // Only set helper text if there is no receiver account otherwise message will be displayed on side bar
  const showInputHelper = !data.receiverAccount ? txError : undefined;

  return (
    <div>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Cross Chain Tracker')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <StyledMainContent>
        <StyledForm onSubmit={validateThenSubmit(handleSubmit)}>
          <StyledAccountForm>
            <Heading as="h5">Search Request</Heading>
            <RequestKeyField
              helperText={showInputHelper}
              status={showInputError}
              inputProps={{
                ...register('requestKey'),
                onKeyUp: checkRequestKey,
              }}
              error={errors.requestKey}
            />
          </StyledAccountForm>
          <StyledFormButton>
            <Button title={t('Search')} icon="Magnify" iconAlign="right">
              {t('Search')}
            </Button>
          </StyledFormButton>
        </StyledForm>

        {data.receiverAccount ? (
          <StyledInfoBox>
            <StyledInfoTitle>{t('Transfer Information')}</StyledInfoTitle>
            <TrackerCard
              variant="vertical"
              icon={ProductIcon.QuickStart}
              labelValues={[
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
                data?.id === StatusId.Success
                  ? ProductIcon.Receiver
                  : ProductIcon.ReceiverInactive
              }
              labelValues={[
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
    </div>
  );
};

export default CrossChainTransferTracker;
