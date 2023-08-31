import {
  Breadcrumbs,
  Button,
  Grid,
  InputWrapperStatus,
  Notification,
  ProgressBar,
  Stack,
  TrackerCard,
} from '@kadena/react-ui';

import {
  formButtonStyle,
  headerTextStyle,
  infoBoxStyle,
  mainContentStyle,
} from './styles.css';

import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { FormItemCard } from '@/components/Global/FormItemCard';
import RequestKeyField, {
  REQUEST_KEY_VALIDATION,
} from '@/components/Global/RequestKeyField';
import Routes from '@/constants/routes';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { useDidUpdateEffect } from '@/hooks';
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
      icon: 'Transition',
      href: Routes.CROSS_CHAIN_TRANSFER_TRACKER,
    },
    {
      title: t('Finalize Cross Chain'),
      icon: 'TransitionMasked',
      href: Routes.CROSS_CHAIN_TRANSFER_FINISHER,
    },
    {
      title: t('Module Explorer'),
      icon: 'Earth',
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
    setInputError('');
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

    setTxError('');

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
      setTxError('');
    }
  }, [errors.requestKey?.message]);

  return (
    <div className={mainContentStyle}>
      <Stack
        direction="column"
        paddingTop={'$2'}
        paddingBottom={'$10'}
        gap={'$6'}
      >
        <Stack direction="column" gap={'$2'}>
          <Breadcrumbs.Root>
            <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
            <Breadcrumbs.Item>{t('Cross Chain Tracker')}</Breadcrumbs.Item>
          </Breadcrumbs.Root>
          <Stack
            gap={'$6'}
            justifyContent={'space-between'}
            alignItems={'flex-end'}
          >
            <div className={headerTextStyle}>
              {t('Track & trace transactions')}
            </div>
            {data.id === StatusId.Pending ? (
              <Button
                title={t('Finish Transaction')}
                as="a"
                href={`/transactions/cross-chain-transfer-finisher?reqKey=${requestKey}`}
                icon="Link"
                iconAlign="right"
                variant="positive"
              >
                {t('Finish Transaction')}
              </Button>
            ) : null}
          </Stack>
        </Stack>

        {txError ? (
          <Notification.Root
            hasCloseButton
            color="negative"
            onClose={() => {
              setTxError('');
            }}
            title="Warning"
            icon={'AlertBox'}
          >
            {txError}
            <Notification.Actions>
              <Notification.Button
                color="negative"
                icon={'Refresh'}
                onClick={validateThenSubmit(handleSubmit)}
              >
                {t('Retry')}
              </Notification.Button>
            </Notification.Actions>
          </Notification.Root>
        ) : null}
        <form onSubmit={validateThenSubmit(handleSubmit)}>
          <FormItemCard
            heading={t('Search Request')}
            helper={t('Where can I find the request key?')}
            helperHref="#"
            disabled={false}
          >
            <Grid.Root>
              <Grid.Item>
                <RequestKeyField
                  helperText={inputError || undefined}
                  status={validRequestKey}
                  inputProps={{
                    ...register('requestKey'),
                    onKeyUp: checkRequestKey,
                    onChange: onRequestKeyChange,
                  }}
                  error={errors.requestKey}
                />
              </Grid.Item>
            </Grid.Root>
          </FormItemCard>
          <div className={formButtonStyle}>
            <Button
              type="submit"
              title={t('Search')}
              icon="Magnify"
              iconAlign="right"
            >
              {t('Search')}
            </Button>
          </div>
        </form>

        {data.receiverAccount ? (
          <DrawerToolbar
            ref={drawerPanelRef}
            initialOpenItem={0}
            sections={[
              {
                icon: 'Information',
                title: t('Transfer Information'),
                children: (
                  <div className={infoBoxStyle}>
                    <TrackerCard
                      variant="vertical"
                      icon={'QuickStart'}
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
                          ? 'Receiver'
                          : 'ReceiverInactive'
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
      </Stack>
    </div>
  );
};

export default CrossChainTransferTracker;
