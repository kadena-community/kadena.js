import {
  Breadcrumbs,
  Button,
  ProductIcon,
  SystemIcon,
  TextField,
  TrackerCard,
} from '@kadena/react-ui';

import AccountNameField, {
  NAME_VALIDATION,
} from '@/components/Global/AccountNameField';
import RequestKeyField, {
  REQUEST_KEY_VALIDATION,
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
import { validateRequestKey } from '@/services/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';
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
  server: z
    .string()
    .trim()
    .regex(DOMAIN_NAME_REGEX, 'Invalid Domain Name')
    .optional(),
  gasPayer: NAME_VALIDATION.optional(),
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

  const checkRequestKey = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    e.preventDefault();
    debug(checkRequestKey.name);

    const requestKey = e.currentTarget.value;

    if (!validateRequestKey(requestKey)) {
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
    }
  };

  const {
    register,
    handleSubmit: validateThenSubmit,
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
    },
    // @see https://www.react-hook-form.com/faqs/#Howtoinitializeformvalues
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  const watchAdvancedOptions = watch('advancedOptions');
  const watchGasPayer = watch('gasPayer');

  const isGasStation = watchGasPayer === 'kadena-xchain-gas';
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
              helperText={showInputHelper}
              status={showInputError}
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
                <AccountNameField
                  label={t('Gas Payer')}
                  inputProps={{
                    ...register('gasPayer', { shouldUnregister: true }),
                    id: 'gas-payer-account-input',
                    placeholder: t('Enter Your Account'),
                  }}
                  error={errors.gasPayer}
                />
              </>
            ) : null}
          </StyledAccountForm>
          <StyledFormButton>
            <Button
              title={t('Finish Cross Chain Transfer')}
              disabled={!isGasStation}
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
