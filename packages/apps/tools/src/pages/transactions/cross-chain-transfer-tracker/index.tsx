import {
  Breadcrumbs,
  Button,
  IconButton,
  InputWrapperStatus,
  Notification,
  ProductIcon,
  ProgressBar,
  SystemIcon,
  TextField,
  TrackerCard,
} from '@kadena/react-ui';

import {
  accountFormStyle,
  formButtonStyle,
  formHeaderStyle,
  formHeaderTitleStyle,
  formStyle,
  headerContainerStyle,
  headerTextStyle,
  infoBoxStyle,
  mainContentStyle,
  topContainerStyle,
} from './styles.css';

import { REQUEST_KEY_VALIDATION } from '@/components/Global/RequestKeyField';
import Routes from '@/constants/routes';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import {
  getTransferStatus,
  IStatusData,
  StatusId,
} from '@/services/transfer-tracker/get-transfer-status';
import { validateRequestKey } from '@/services/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Debug from 'debug';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { useDidUpdateEffect } from '@/hooks';

const schema = z.object({
  requestKey: REQUEST_KEY_VALIDATION,
});

type FormData = z.infer<typeof schema>;

const CrossChainTransferTracker: FC = () => {
  const { selectedNetwork: network } = useWalletConnectClient();
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

  const [requestKey, setRequestKey] = useState<string>(
    (router.query?.reqKey as string) || '',
  );
  const [data, setData] = useState<IStatusData>({});
  const [txError, setTxError] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [validRequestKey, setValidRequestKey] = useState<
    InputWrapperStatus | undefined
  >();
  const drawerPanelRef = useRef<HTMLElement | null>(null);

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

  const checkRequestKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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

  const onRequestKeyChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setRequestKey(e.target.value);
    },
    [],
  );

  useEffect(() => {
    if (errors.requestKey?.message) {
      setInputError(errors.requestKey.message);
    }
  }, [errors.requestKey?.message]);

  return (
    <div className={mainContentStyle}>
      <div className={topContainerStyle}>
        <Breadcrumbs.Root>
          <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
          <Breadcrumbs.Item>{t('Cross Chain Tracker')}</Breadcrumbs.Item>
        </Breadcrumbs.Root>
        <div className={headerContainerStyle}>
          <div className={headerTextStyle}>
            {t('Track & trace transactions')}
          </div>
          <Button title={t('Search')} icon="Magnify" iconAlign="right">
            {t('Search')}
          </Button>
        </div>
      </div>

      <Notification.Root
        hasCloseButton
        onClose={() => {}}
        title="Notification title"
      >
        Notification text to inform users about the event that occurred!
        <Notification.Actions>
          <Notification.Button color="positive" icon={SystemIcon.Account}>
            Accept
          </Notification.Button>
          <Notification.Button color="negative" icon={SystemIcon.Account}>
            Reject
          </Notification.Button>
        </Notification.Actions>
      </Notification.Root>

      <form className={formStyle} onSubmit={validateThenSubmit(handleSubmit)}>
        <div className={formHeaderStyle}>
          <div className={formHeaderTitleStyle}>Search Request</div>
        </div>
        <div className={accountFormStyle}>
          <TextField
            label={t('Request Key')}
            status={validRequestKey}
            // Only set helper text if there is no receiver account otherwise message will be displayed on side bar
            // helperText={!data.receiverAccount ? txError : undefined}
            helperText={inputError || undefined}
            inputProps={{
              ...register('requestKey'),
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
        <DrawerToolbar
          ref={drawerPanelRef}
          initialOpenItem={true}
          sections={[
            {
              icon: SystemIcon.Information,
              title: t('Transfer Information'),
              children: (
                <div className={infoBoxStyle}>
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
                          data?.id === StatusId.Success
                            ? 'complete'
                            : 'pending',
                        title: data.description || 'An error has occurred',
                      },
                      {
                        status:
                          data.id === StatusId.Pending
                            ? 'incomplete'
                            : 'complete',
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
              ),
            },
          ]}
        />
      ) : null}
    </div>
  );
};

export default CrossChainTransferTracker;
