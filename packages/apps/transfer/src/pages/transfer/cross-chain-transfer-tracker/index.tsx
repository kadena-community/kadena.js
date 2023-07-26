import {
  Breadcrumbs,
  Button,
  Heading,
  InputWrapperStatus,
  ProductIcon,
  ProgressBar,
  SystemIcon,
  TextField,
  TrackerCard,
} from '@kadena/react-ui';

import {
  accountFormStyle,
  formButtonStyle,
  formStyle,
  infoBoxStyle,
  infoTitleStyle,
  mainContentStyle,
} from './styles.css';

import Routes from '@/constants/routes';
import { useAppContext } from '@/context/app-context';
import { useToolbar } from '@/context/layout-context';
import { useDidUpdateEffect } from '@/hooks';
import {
  getTransferStatus,
  IStatusData,
  StatusId,
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
  const { t } = useTranslation('common');

  useToolbar([
    {
      title: t('Account Transaction'),
      icon: SystemIcon.Account,
      href: Routes.ACCOUNT_TRANSACTIONS,
    },
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
      icon: SystemIcon.BadgeAccount,
      href: Routes.MODULE_EXPLORER,
    },
  ]);

  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-tracker',
  );
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
    <div>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Cross Chain Tracker')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <div className={mainContentStyle}>
        <form className={formStyle} onSubmit={handleSubmit}>
          <div className={accountFormStyle}>
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
          </div>
          <div className={formButtonStyle}>
            <Button title={t('Search')} icon="Magnify" iconAlign="right">
              {t('Search')}
            </Button>
          </div>
        </form>

        {data.receiverAccount ? (
          <div className={infoBoxStyle}>
            <div className={infoTitleStyle}>{t('Transfer Information')}</div>
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
            {/*  Progress Bar will only show if the transfer is in progress /
            completed.  If an error occurs, the notification will display the
            error and no progress bar will show */}
            <ProgressBar
              checkpoints={[
                {
                  status: 'complete',
                  title: t('Initiated transaction'),
                },
                {
                  status:
                    data?.id === StatusId.Success ? 'complete' : 'pending',
                  title: data.description || 'An error has occurred',
                },
                {
                  status:
                    data.id === StatusId.Pending ? 'incomplete' : 'complete',
                  title: t('Transfer complete'),
                },
              ]}
            />

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
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CrossChainTransferTracker;
