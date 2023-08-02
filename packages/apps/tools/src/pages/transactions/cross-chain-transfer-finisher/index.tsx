import {
  Breadcrumbs,
  Button,
  ProductIcon,
  SystemIcon,
  TextField,
  TrackerCard,
} from '@kadena/react-ui';

import RequestKeyField, {
  REQUEST_KEY_VALIDATION,
  RequestLength,
} from '@/components/Global/RequestKeyField';
import client from '@/constants/client';
import { chainNetwork } from '@/constants/network';
import Routes from '@/constants/routes';
import { useAppContext } from '@/context/app-context';
import { useToolbar } from '@/context/layout-context';
import {
  StyledAccountForm,
  StyledCheckbox,
  StyledCheckboxLabel,
  StyledErrorMessage,
  StyledFieldCheckbox,
  StyledFinisherContent,
  StyledForm,
  StyledFormButton,
  StyledInfoBox,
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
  StyledInfoTitle,
  StyledResultContainer,
  StyledShowMore,
  StyledToggleContainer,
  StyledTotalChunk,
  StyledTotalContainer,
} from '@/pages/transactions/cross-chain-transfer-finisher/styles';
import {
  finishXChainTransfer,
  ITransferResult,
} from '@/services/cross-chain-transfer-finish/finish-xchain-transfer';
import {
  getTransferData,
  ITransferDataResult,
} from '@/services/cross-chain-transfer-finish/get-transfer-data';
import { formatNumberAsString } from '@/utils/number';
import { zodResolver } from '@hookform/resolvers/zod';
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface IPactResultError {
  status: 'failure';
  error: {
    message: string;
  };
}

// @see; https://www.geeksforgeeks.org/how-to-validate-a-domain-name-using-regular-expression/
const DOMAIN_NAME_REGEX =
  /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/;

const schema = z.object({
  requestKey: REQUEST_KEY_VALIDATION,
  advancedOptions: z.boolean().optional(),
  server: z.string().regex(DOMAIN_NAME_REGEX, 'Invalid Domain Name').optional(),
  gasPayer: z.string().min(3).max(256).optional(),
  gasPrice: z.number().positive().max(1).optional(),
});

type FormData = z.infer<typeof schema>;

const CrossChainTransferFinisher: FC = () => {
  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-finisher',
  );
  const { t } = useTranslation('common');
  const { network } = useAppContext();

  const [showMore, setShowMore] = useState<boolean>(false);
  const [pollResults, setPollResults] = useState<ITransferDataResult>({});
  const [finalResults, setFinalResults] = useState<ITransferResult>({});
  const [txError, setTxError] = useState('');

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

  // useEffect(() => {
  //   setRequestKey('');
  //   setPollResults({});
  //   setFinalResults({});
  //   setTxError('');
  // }, [network]);

  const checkRequestKey = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    e.preventDefault();
    debug(checkRequestKey.name);

    const requestKey = e.currentTarget.value;

    if (
      requestKey.length < RequestLength.MIN ||
      requestKey.length > RequestLength.MAX
    ) {
      return;
    }

    setFinalResults({});
    setTxError('');

    const pollResult: ITransferDataResult | undefined = await getTransferData({
      requestKey,
      network,
      t,
    });

    if (pollResult === undefined) {
      return;
    }

    setPollResults(pollResult);
    if (pollResults.tx === undefined) {
      return;
    }
  };

  const handleSubmit = async (data: FormData) => {
    debug(handleSubmit.name);

    if (!pollResults.tx) {
      return;
    }

    const networkId = chainNetwork[network].network;

    // TODO: Remove
    // return;

    const options = {
      networkId: networkId,
      chainId: pollResults.tx.sender.chain,
    };

    const proof = await client.pollCreateSpv(
      data.requestKey,
      pollResults.tx.receiver.chain,
      options,
    );

    const status = await client.listen(data.requestKey, options);

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

      // const contCommand = await finishXChainTransfer(
      //   data.requestKey,
      //   pollResults.tx.step,
      //   pollResults.tx.rollback,
      //   network,
      //   pollResults.tx.receiver.chain,
      //   data.gasPayer!,
    );

    if (typeof requestKeyOrError !== 'string') {
      setTxError((requestKeyOrError as { error: string }).error);
    }

    try {
      const result = await client.listen(requestKeyOrError as string);
      setFinalResults({
        requestKey: result.reqKey,
        status: result.result.status,
      });
    } catch (tx) {
      debug(tx);
      setFinalResults({ ...tx });
      // if (contCommand instanceof ContCommand) {
      //   try {
      //     const pollResult = await contCommand.pollUntil(host, {
      //       onPoll: async (transaction, pollRequest): Promise<void> => {
      //         // debug(`Polling ${data.requestKey}.\nStatus: ${transaction.status}`);
      //         setFinalResults({
      //           requestKey: transaction.requestKey,
      //           status: transaction.status,
      //         });
      //         debug(await pollRequest);
      //         const data: IPollResponse = await pollRequest;

      //         // Show correct error message
      //         if (
      //           Object.keys(data).length > 0 &&
      //           Object.values(data)[0].result.status === 'failure'
      //         ) {
      //           const errorResult: IPactResultError = Object.values(data)[0]
      //             .result as IPactResultError;
      //           if (errorResult !== undefined) {
      //             setTxError(errorResult.error.message);
      //           }
      //         }
      //       },
      //     });
      //     setFinalResults({
      //       requestKey: pollResult.reqKey,
      //       status: pollResult.result.status,
      //     });
      //   } catch (tx) {
      //     debug(tx);
      //     setFinalResults({ ...tx });
      //   }
    }
  };

  // const showInputError =
  //   pollResults.error === undefined ? undefined : 'negative';
  // const showInputInfo = requestKey ? '' : t('(Not a Cross Chain Request Key');
  // const showInputHelper =
  //   pollResults.error !== undefined ? pollResults.error : '';
  // const isGasStation = kadenaXChainGas === 'kadena-xchain-gas';
  // const formattedGasPrice = gasPrice
  //   .toFixed(20)
  //   .replace(/(?<=\.\d*[1-9])0+$|\.0*$/, '');

  const {
    register,
    handleSubmit: validateThenSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      server: chainNetwork[network].server,
      requestKey: 'IjqP2vrzhL5NoCICC1m29gMVTCts1l5YWjDkhHmuefQ',
      gasPayer: 'kadena-xchain-gas',
      gasPrice: 0.00000001,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const watchAdvancedOptions = watch('advancedOptions');

  return (
    <div>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Cross Chain Finisher')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <StyledFinisherContent>
        <StyledForm onSubmit={validateThenSubmit(handleSubmit)}>
          <StyledAccountForm>
            <StyledToggleContainer>
              <StyledFieldCheckbox>
                <StyledCheckbox
                  {...register('advancedOptions')}
                  type="checkbox"
                  id="advanced-options"
                  placeholder={t('Enter private key to sign the transaction')}
                />
                <StyledCheckboxLabel htmlFor="advanced-options">
                  {t('Advanced options')}
                </StyledCheckboxLabel>
              </StyledFieldCheckbox>
            </StyledToggleContainer>

            <RequestKeyField
              inputProps={{
                ...register('requestKey'),
                onKeyUp: checkRequestKey,
              }}
              error={errors.requestKey}
            />

            {watchAdvancedOptions ? (
              <>
                <TextField
                  label="Chain Server"
                  status={errors.server ? 'negative' : undefined}
                  helperText={errors.server?.message ?? ''}
                  inputProps={{
                    ...register('server', { shouldUnregister: true }),
                    id: 'chain-server-input',
                    placeholder: t('Enter Chain Server'),
                    leadingText: chainNetwork[network].network,
                  }}
                />
                <TextField
                  label={t('Gas Payer')}
                  // helperText={
                  //   isGasStation
                  //     ? ''
                  //     : t('only gas station account is supported')
                  // }
                  status={errors.gasPayer ? 'negative' : undefined}
                  helperText={errors.gasPayer?.message ?? ''}
                  inputProps={{
                    ...register('gasPayer', { shouldUnregister: true }),
                    id: 'gas-payer-account-input',
                    placeholder: t('Enter Your Account'),
                  }}
                />
                <TextField
                  label={t('Gas Price')}
                  status={errors.gasPrice ? 'negative' : undefined}
                  helperText={errors.gasPrice?.message ?? ''}
                  inputProps={{
                    ...register('gasPrice', {
                      shouldUnregister: true,
                    }),
                    id: 'gas-price-input',
                    placeholder: t('Enter Gas Price'),
                  }}
                />
              </>
            ) : null}
          </StyledAccountForm>
          <StyledFormButton>
            <Button
              title={t('Finish Cross Chain Transfer')}
              // disabled={!isGasStation}
            >
              {t('Finish Cross Chain Transfer')}
            </Button>
          </StyledFormButton>

          {txError.toString() !== '' ? (
            <StyledErrorMessage>
              {t('Error')}: {txError.toString()}
            </StyledErrorMessage>
          ) : null}

          {Object.keys(finalResults).length > 0 ? (
            <StyledResultContainer>
              <StyledTotalContainer>
                <StyledTotalChunk>
                  <p>{t('Request Key')}</p>
                  <p>{finalResults.requestKey}</p>
                </StyledTotalChunk>
                <StyledTotalChunk>
                  <p>{t('Status')}</p>
                  <p>{finalResults.status}</p>
                </StyledTotalChunk>
              </StyledTotalContainer>
            </StyledResultContainer>
          ) : null}
        </StyledForm>

        {pollResults.tx ? (
          <StyledInfoBox>
            <StyledInfoTitle>{t('Pact Information')}</StyledInfoTitle>
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
                  value: pollResults.tx.sender.account,
                  isAccount: true,
                },
                {
                  label: t('Chain'),
                  value: pollResults.tx.sender.chain,
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
                {
                  label: t('Price'),
                  value: formatNumberAsString(getValues('gasPrice')!),
                },
              ]}
            />

            <TrackerCard
              variant="vertical"
              icon={ProductIcon.Receiver}
              labelValues={[
                {
                  label: t('Receiver'),
                  value: pollResults.tx.receiver.account,
                  isAccount: true,
                },
                {
                  label: t('Chain'),
                  value: pollResults.tx.receiver.chain,
                },
              ]}
            />

            {showMore ? (
              <StyledInfoItem>
                <StyledInfoItemTitle>{t('Receiver guard')}</StyledInfoItemTitle>
                <StyledInfoItemLine>{`${t('Pred')}: ${
                  pollResults.tx.receiverGuard.pred
                }`}</StyledInfoItemLine>
                <StyledInfoItemLine>
                  {t('Keys')}:
                  {pollResults.tx.receiverGuard.keys.map((key, index) => (
                    <StyledInfoItemLine key={index}>{key}</StyledInfoItemLine>
                  ))}
                </StyledInfoItemLine>
              </StyledInfoItem>
            ) : null}

            <StyledShowMore onClick={() => setShowMore(!showMore)}>
              {!showMore ? t('Show more') : t('Show less')}
            </StyledShowMore>
          </StyledInfoBox>
        ) : null}
      </StyledFinisherContent>
    </div>
  );
};

export default CrossChainTransferFinisher;
