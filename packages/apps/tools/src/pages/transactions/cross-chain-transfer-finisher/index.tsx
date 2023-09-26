import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Heading,
  IconButton,
  Stack,
  TextField,
  TrackerCard,
} from '@kadena/react-ui';

import {
  formButtonStyle,
  formContentStyle,
  notificationContainerStyle,
  sidebarLinksStyle,
  textareaContainerStyle,
  textAreaStyle,
} from './styles.css';

import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { FormStatusNotification } from '@/components/Global';
import {
  AccountNameField,
  NAME_VALIDATION,
} from '@/components/Global/AccountNameField';
import { FormItemCard } from '@/components/Global/FormItemCard';
import RequestKeyField, {
  REQUEST_KEY_VALIDATION,
} from '@/components/Global/RequestKeyField';
import ResourceLinks from '@/components/Global/ResourceLinks';
import client from '@/constants/client';
import { kadenaConstants } from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import Routes from '@/constants/routes';
import { useAppContext } from '@/context/app-context';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { useDidUpdateEffect } from '@/hooks';
import type { ITransferResult } from '@/services/cross-chain-transfer-finish/finish-xchain-transfer';
import { finishXChainTransfer } from '@/services/cross-chain-transfer-finish/finish-xchain-transfer';
import type { ITransferDataResult } from '@/services/cross-chain-transfer-finish/get-transfer-data';
import { getTransferData } from '@/services/cross-chain-transfer-finish/get-transfer-data';
import { validateRequestKey } from '@/services/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Debug from 'debug';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import type { ChangeEventHandler, FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// @see; https://www.geeksforgeeks.org/how-to-validate-a-domain-name-using-regular-expression/
const DOMAIN_NAME_REGEX: RegExp =
  /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/;

const schema = z.object({
  requestKey: REQUEST_KEY_VALIDATION,
  advancedOptions: z.boolean().optional(),
  server: z
    .string()
    .trim()
    .regex(DOMAIN_NAME_REGEX, 'Invalid Domain Name')
    .optional(),
  gasPayer: NAME_VALIDATION.optional(),
  gasLimit: z.number().optional(),
  gasPrice: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface IErrorObject {
  message: string;
}

const CrossChainTransferFinisher: FC = () => {
  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-finisher',
  );
  const { t } = useTranslation('common');
  const router = useRouter();
  const { devOption } = useAppContext();
  const { selectedNetwork: network } = useWalletConnectClient();
  const helpCenterRef = useRef<HTMLElement | null>(null);

  const [requestKey, setRequestKey] = useState<string>(
    (router.query?.reqKey as string) || '',
  );
  const [pollResults, setPollResults] = useState<ITransferDataResult>({});
  const [finalResults, setFinalResults] = useState<ITransferResult>({});
  const [txError, setTxError] = useState('');

  const handleOpenHelpCenter = (): void => {
    // @ts-ignore
    helpCenterRef.openSection(0);
  };

  const checkRequestKey = async (reqKey = requestKey): Promise<void> => {
    if (!validateRequestKey(reqKey)) {
      return;
    }

    setTxError('');
    setFinalResults({});

    const pollResult: ITransferDataResult | undefined = await getTransferData({
      requestKey: reqKey,
      network,
      t,
    });

    if (pollResult === undefined) {
      return;
    }

    setPollResults(pollResult);
    handleOpenHelpCenter();
    if (pollResults.tx === undefined) {
      return;
    }
  };

  const onCheckRequestKey = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    e.preventDefault();
    debug(onCheckRequestKey.name);

    await checkRequestKey();
  };

  const handleValidateSubmit = async (data: FormData): Promise<void> => {
    debug(handleValidateSubmit.name);

    if (!pollResults.tx) {
      return;
    }

    const networkId = chainNetwork[network].network;

    const requestObject = {
      requestKey: data.requestKey,
      networkId: networkId,
      chainId: pollResults.tx.sender.chain,
    };

    const proof = await client.pollCreateSpv(
      requestObject,
      pollResults.tx.receiver.chain,
    );

    const status = await client.listen(requestObject);

    const pactId = status.continuation?.pactId;

    const requestKeyOrError = await finishXChainTransfer(
      {
        pactId,
        proof,
        rollback: false,
        step: 1,
      },
      pollResults.tx.receiver.chain,
      networkId,
      data.gasPayer,
    );

    if (typeof requestKeyOrError !== 'string') {
      setTxError((requestKeyOrError as { error: string }).error);
    }

    try {
      const data = await client.listen({
        requestKey: requestKeyOrError as string,
        networkId,
        chainId: pollResults.tx.receiver.chain,
      });
      if (data.result.status === 'failure') {
        const error: IErrorObject = data.result.error as IErrorObject;
        setTxError(error.message);
      }
      setFinalResults({
        requestKey: data.reqKey,
        status: data.result.status,
      });
    } catch (tx) {
      debug(tx);

      setFinalResults({ ...tx });
    }
  };

  const onRequestKeyChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setRequestKey(e.target.value);
    },
    [],
  );

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

  useDidUpdateEffect(async () => {
    if (!router.isReady) {
      return;
    }
    const { reqKey } = router.query;
    if (reqKey) {
      setRequestKey(reqKey as string);
      await checkRequestKey(reqKey as string);
      handleOpenHelpCenter();
    }
  }, [router.isReady]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    resetField,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      server: chainNetwork[network].server,
      requestKey: requestKey,
      gasPayer: 'kadena-xchain-gas',
      gasLimit: kadenaConstants.GAS_LIMIT,
      gasPrice: kadenaConstants.GAS_PRICE.toFixed(8),
    },
    // @see https://www.react-hook-form.com/faqs/#Howtoinitializeformvalues
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  const watchGasPayer = watch('gasPayer');

  const isGasStation = watchGasPayer === 'kadena-xchain-gas';
  const isAdvancedOptions = devOption !== 'BASIC';
  const showInputError =
    pollResults.error === undefined ? undefined : 'negative';
  const showInputHelper =
    pollResults.error !== undefined ? pollResults.error : '';
  const showNotification = Object.keys(finalResults).length > 0;

  const formattedSigData = `{
    "pred": "${pollResults.tx?.receiverGuard.pred}",
    "sigs": ${pollResults.tx?.receiverGuard.keys.map((key) => `"${key}"`)}"
  }`;

  const renderNotification =
    txError.toString() === '' ? (
      <FormStatusNotification
        status="successful"
        title={t('Notification title')}
      >
        {t('XChain transfer has been successfully finalized!')}
      </FormStatusNotification>
    ) : (
      <FormStatusNotification status="erroneous" title={t('Transaction error')}>
        {txError.toString()}
      </FormStatusNotification>
    );

  useEffect(() => {
    resetField('requestKey');
    setPollResults({});
    setFinalResults({});
    setTxError('');
  }, [network, resetField]);

  return (
    <div>
      <DrawerToolbar
        ref={helpCenterRef}
        sections={[
          {
            icon: 'HelpCircle',
            title: t('Pact Information'),
            children: (
              <>
                <TrackerCard
                  variant="vertical"
                  labelValues={[
                    {
                      label: t('Network'),
                      value: chainNetwork[network].network,
                    },
                    {
                      label: t('Server'),
                      value: chainNetwork[network].server,
                    },
                  ]}
                />
                <TrackerCard
                  variant="vertical"
                  icon="QuickStart"
                  labelValues={[
                    {
                      label: t('Sender'),
                      value: pollResults?.tx?.sender.account,
                      isAccount: true,
                    },
                    {
                      label: t('Chain'),
                      value: pollResults?.tx?.sender.chain,
                    },
                  ]}
                />
                <TrackerCard
                  variant="vertical"
                  icon="Gas"
                  labelValues={[
                    {
                      label: t('Gas Payer'),
                      value: getValues('gasPayer'),
                      isAccount: false,
                    },
                  ]}
                />
                <TrackerCard
                  variant="vertical"
                  icon="Receiver"
                  labelValues={[
                    {
                      label: t('Receiver'),
                      value: pollResults?.tx?.receiver.account,
                      isAccount: true,
                    },
                    {
                      label: t('Chain'),
                      value: pollResults?.tx?.receiver.chain,
                    },
                  ]}
                />
                <div className={sidebarLinksStyle}>
                  <ResourceLinks
                    links={[{ title: t('Transactions link'), href: '#' }]}
                  />
                </div>
              </>
            ),
          },
        ]}
      />

      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Cross Chain Finisher')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Heading as="h3" transform="capitalize" bold={false}>
        {t('Finish transaction')}
      </Heading>

      {showNotification ? (
        <div className={notificationContainerStyle}>{renderNotification}</div>
      ) : null}

      <form onSubmit={handleSubmit(handleValidateSubmit)}>
        <section className={formContentStyle}>
          <Stack direction="column">
            <FormItemCard
              heading={t('Search Request')}
              helper={t('Where can I find the request key?')}
              helperHref="#"
              disabled={false}
            >
              <Box marginBottom="$4" />
              <Grid.Root>
                <Grid.Item>
                  <RequestKeyField
                    helperText={showInputHelper}
                    status={showInputError}
                    inputProps={{
                      ...register('requestKey'),
                      onKeyUp: onCheckRequestKey,
                      onChange: onRequestKeyChange,
                      value: requestKey,
                    }}
                    error={errors.requestKey}
                  />
                </Grid.Item>
              </Grid.Root>
            </FormItemCard>

            <FormItemCard
              heading={t('Gas Settings')}
              helper={t('What is a gas payer?')}
              helperHref="#"
              disabled={false}
            >
              <Box marginBottom="$4" />
              <Grid.Root columns={1}>
                <Grid.Item>
                  <AccountNameField
                    label={t('Gas Payer')}
                    inputProps={{
                      ...register('gasPayer', { shouldUnregister: true }),
                      id: 'gas-payer-account-input',
                      placeholder: t('Enter Your Account'),
                    }}
                    error={errors.gasPayer}
                  />
                </Grid.Item>
              </Grid.Root>

              <Box marginBottom="$4" />
              <Grid.Root columns={2}>
                <Grid.Item>
                  <TextField
                    disabled={true}
                    label={t('Gas Price')}
                    info={t('approx. USD 000.1 ¢')}
                    leadingTextWidth="$16"
                    inputProps={{
                      ...register('gasPrice', { shouldUnregister: true }),
                      id: 'gas-price-input',
                      placeholder: t('Enter Gas Price'),
                      leadingText: t('KDA'),
                    }}
                  />
                </Grid.Item>
                <Grid.Item>
                  <TextField
                    disabled={!isAdvancedOptions}
                    helperText={t(
                      'This input field will only be enabled if the user is in expert mode',
                    )}
                    label={t('Gas Limit')}
                    inputProps={{
                      ...register('gasLimit', { shouldUnregister: true }),
                      id: 'gas-limit-input',
                      placeholder: t('Enter Gas Limit'),
                    }}
                  />
                </Grid.Item>
              </Grid.Root>
            </FormItemCard>

            {pollResults.tx !== undefined ? (
              <FormItemCard
                heading={t('SigData')}
                helper={t('How do I use the Signature data')}
                helperHref="#"
              >
                <Box marginBottom="$4" />
                <Grid.Root columns={1}>
                  <Grid.Item>
                    <div className={textareaContainerStyle}>
                      <textarea rows={4} className={textAreaStyle}>
                        {formattedSigData}
                      </textarea>
                      <IconButton
                        color="primary"
                        icon={'ContentCopy'}
                        onClick={async () => {
                          await navigator.clipboard.writeText(formattedSigData);
                        }}
                        title={t('copySigData')}
                      />
                    </div>
                  </Grid.Item>
                </Grid.Root>
              </FormItemCard>
            ) : null}
          </Stack>
        </section>
        <section className={formButtonStyle}>
          <Button type="submit" disabled={!isGasStation} icon="TrailingIcon">
            {t('Finish Transaction')}
          </Button>
        </section>
      </form>
    </div>
  );
};

export default CrossChainTransferFinisher;
