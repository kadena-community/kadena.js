import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Heading,
  InputWrapperStatus,
  ProductIcon,
  Stack,
  SystemIcon,
  TextField,
  TrackerCard,
} from '@kadena/react-ui';

import {
  formButtonStyle,
  formContentStyle,
  sidebarLinksStyle,
} from './styles.css';

import DrawerToolbar from '@/components/Common/DrawerToolbar';
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
import {
  finishXChainTransfer,
  ITransferResult,
} from '@/services/cross-chain-transfer-finish/finish-xchain-transfer';
import {
  getTransferData,
  ITransferDataResult,
} from '@/services/cross-chain-transfer-finish/get-transfer-data';
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

const CrossChainTransferFinisher: FC = () => {
  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-finisher',
  );
  const { t } = useTranslation('common');
  const router = useRouter();
  const { devOption } = useAppContext();

  const helpCenterRef = useRef<HTMLElement | null>(null);


  //new new
  const [requestKey, setRequestKey] = useState<string>(
    (router.query?.reqKey as string) || '',
  );
  const [validRequestKey, setValidRequestKey] = useState<
    InputWrapperStatus | undefined
  >();
  const { selectedNetwork: network } = useWalletConnectClient();

  const [pollResults, setPollResults] = useState<ITransferDataResult>({});
  const [finalResults, setFinalResults] = useState<ITransferResult>({});
  const [txError, setTxError] = useState('');

  const [gasLimit, setGasLimit] = useState<number>(kadenaConstants.GAS_LIMIT);

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

  // useDidUpdateEffect(() => {
  //   if (!router.isReady) {
  //     console.log('ovede 1');
  //     return;
  //   }
  //   const { reqKey } = router.query;
  //   if (reqKey) {
  //     console.log('ovede 2');
  //     setRequestKey(reqKey as string);
  //   }
  // }, [router.isReady]);

  const handleOpenHelpCenter = (): void => {
    // @ts-ignore
    helpCenterRef.openSection(0);
  };

  const checkRequestKey = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    console.log('Getting here!');
    e.preventDefault();
    debug(checkRequestKey.name);

    console.log('REQ KEY:', requestKey);

    if (!validateRequestKey(requestKey)) {
      return;
    }

    setTxError('');
    setFinalResults({});

    const pollResult: ITransferDataResult | undefined = await getTransferData({
      requestKey,
      network,
      t,
    });

    console.log("got here, but poll is: ", pollResult);

    if (pollResult === undefined) {
      return;
    }

    setPollResults(pollResult);
    handleOpenHelpCenter();
    if (pollResults.tx === undefined) {
      return;
    }
  };

  const handleValidateSubmit = async (data: FormData): Promise<void> => {
    debug(handleValidateSubmit.name);

    console.log('HHHHEEEEEEEYYYYYYYYYYYYYYYY');

    if (!pollResults.tx) {
      console.log('woohoooooo');
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
      const result = await client.listen({
        requestKey: requestKeyOrError as string,
        networkId,
        chainId: pollResults.tx.receiver.chain,
      });
      setFinalResults({
        requestKey: result.reqKey,
        status: result.result.status,
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
      requestKey: '',
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
            icon: SystemIcon.HelpCircle,
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
                  icon={ProductIcon.QuickStart}
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
                  icon={ProductIcon.Gas}
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
                  icon={ProductIcon.Receiver}
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
                    links={[{ title: 'Transactions link', href: '#' }]}
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

      <section className={formContentStyle}>
        <form onSubmit={handleSubmit(handleValidateSubmit)}>
         <Stack direction="column">
            <FormItemCard
              heading="Search Request"
              helper="Where can I find the request key?"
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
                      onKeyUp: checkRequestKey,
                      onChange: onRequestKeyChange,
                    }}
                    error={errors.requestKey}
                  />
                </Grid.Item>
              </Grid.Root>
            </FormItemCard>

            <FormItemCard
              heading="Gas Settings"
              helper="What is a gas payer?"
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
                    info={"approx. USD 000.1 ¢"}
                    inputProps={{
                      ...register('gasPrice', { shouldUnregister: true }),
                      id: 'gas-price-input',
                      placeholder: t('Enter Gas Price'),
                      leadingText: 'KDA',
                      leadingTextWidth: '$16',
                    }}
                  />
                </Grid.Item>
                <Grid.Item>
                  <TextField
                    disabled={!isAdvancedOptions}
                    helperText={'This input field will only be enabled if the user is in expert mode'}
                    // status="default"
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

            <FormItemCard
              heading="SigData"
              helper="How do I use the Signature data"
              helperHref="eafa"
            >
              <Box marginBottom="$4" />
              <Grid.Root columns={1}>
                <Grid.Item>
                  <TextField
                    helperText={showInputHelper}
                    status={showInputError}
                    inputProps={{
                      id: 'sig-data-input',
                      // ...register('sigData'),
                      onKeyUp: checkRequestKey,
                      onChange: onRequestKeyChange,
                      rightIcon: SystemIcon.ContentCopy,
                    }}
                  />
                </Grid.Item>
              </Grid.Root>
            </FormItemCard>
          </Stack>

          {/*</div>*/}

          <section className={formButtonStyle}>
            <Button type="submit" disabled={!isGasStation} icon="TrailingIcon">{t('Finish Transaction')}</Button>
          </section>
        </form>
      </section>




      {/*      {watchAdvancedOptions ? (*/}
      {/*        <>*/}
      {/*          <TextField*/}
      {/*            label="Chain Server"*/}
      {/*            status={errors.server ? 'negative' : undefined}*/}
      {/*            helperText={errors.server?.message ?? ''}*/}
      {/*            inputProps={{*/}
      {/*              ...register('server', { shouldUnregister: true }),*/}
      {/*              id: 'chain-server-input',*/}
      {/*              placeholder: t('Enter Chain Server'),*/}
      {/*              leadingText: chainNetwork[network].network,*/}
      {/*            }}*/}
      {/*          />*/}
      {/*          <AccountNameField*/}
      {/*            label={t('Gas Payer')}*/}
      {/*            inputProps={{*/}
      {/*              ...register('gasPayer', { shouldUnregister: true }),*/}
      {/*              id: 'gas-payer-account-input',*/}
      {/*              placeholder: t('Enter Your Account'),*/}
      {/*            }}*/}
      {/*            error={errors.gasPayer}*/}
      {/*          />*/}
      {/*        </>*/}
      {/*      ) : null}*/}
      {/*    </StyledAccountForm>*/}
      {/*    <StyledFormButton>*/}
      {/*      <Button*/}
      {/*        title={t('Finish Cross Chain Transfer')}*/}
      {/*        disabled={!isGasStation}*/}
      {/*      >*/}
      {/*        {t('Finish Cross Chain Transfer')}*/}
      {/*      </Button>*/}
      {/*    </StyledFormButton>*/}

      {/*    {txError.toString() !== '' ? (*/}
      {/*      <StyledErrorMessage>*/}
      {/*        {t('Error')}: {txError.toString()}*/}
      {/*      </StyledErrorMessage>*/}
      {/*    ) : null}*/}

      {/*    {Object.keys(finalResults).length > 0 ? (*/}
      {/*      <StyledResultContainer>*/}
      {/*        <StyledTotalContainer>*/}
      {/*          <StyledTotalChunk>*/}
      {/*            <p>{t('Request Key')}</p>*/}
      {/*            <p>{finalResults.requestKey}</p>*/}
      {/*          </StyledTotalChunk>*/}
      {/*          <StyledTotalChunk>*/}
      {/*            <p>{t('Status')}</p>*/}
      {/*            <p>{finalResults.status}</p>*/}
      {/*          </StyledTotalChunk>*/}
      {/*        </StyledTotalContainer>*/}
      {/*      </StyledResultContainer>*/}
      {/*    ) : null}*/}
      {/*  </StyledForm>*/}

      {/*  {pollResults.tx ? (*/}
      {/*    <StyledInfoBox>*/}
      {/*      <StyledInfoTitle>{t('Pact Information')}</StyledInfoTitle>*/}

      {/*</StyledFinisherContent>*/}
    </div>
  );
};

export default CrossChainTransferFinisher;
