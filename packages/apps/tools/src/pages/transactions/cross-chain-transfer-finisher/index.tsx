import { IPollResponse } from '@kadena/chainweb-node-client';
import { ContCommand } from '@kadena/client';
import {
  Breadcrumbs,
  Button,
  ProductIcon,
  SystemIcon,
  TextField,
  TrackerCard,
} from '@kadena/react-ui';

import { getKadenaConstantByNetwork } from '@/constants/kadena';
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
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';

interface IPactResultError {
  status: 'failure';
  error: {
    message: string;
  };
}

const CrossChainTransferFinisher: FC = () => {
  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-finisher',
  );
  const { t } = useTranslation('common');
  const { network } = useAppContext();

  const [requestKey, setRequestKey] = useState<string>('');
  const [kadenaXChainGas, setKadenaXChainGas] =
    useState<string>('kadena-xchain-gas');
  const [gasPrice, setGasPrice] = useState<number>(0.00000001);
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);
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

  useEffect(() => {
    setRequestKey('');
    setPollResults({});
    setFinalResults({});
    setTxError('');
  }, [network]);

  const checkRequestKey = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    e.preventDefault();
    debug(checkRequestKey.name);

    if (!requestKey) {
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    debug(handleSubmit.name);

    if (!pollResults.tx) {
      return;
    }

    const host = getKadenaConstantByNetwork(network).apiHost({
      networkId: chainNetwork[network].network,
      chainId: pollResults.tx.receiver.chain,
    });

    const contCommand = await finishXChainTransfer(
      requestKey,
      pollResults.tx.step,
      pollResults.tx.rollback,
      network,
      pollResults.tx.receiver.chain,
      kadenaXChainGas,
    );

    if (!(contCommand instanceof ContCommand) && contCommand.error) {
      setTxError(contCommand.error);
    }

    if (contCommand instanceof ContCommand) {
      try {
        const pollResult = await contCommand.pollUntil(host, {
          onPoll: async (transaction, pollRequest): Promise<void> => {
            debug(`Polling ${requestKey}.\nStatus: ${transaction.status}`);
            setFinalResults({
              requestKey: transaction.requestKey,
              status: transaction.status,
            });
            debug(await pollRequest);
            const data: IPollResponse = await pollRequest;

            // Show correct error message
            if (
              Object.keys(data).length > 0 &&
              Object.values(data)[0].result.status === 'failure'
            ) {
              const errorResult: IPactResultError = Object.values(data)[0]
                .result as IPactResultError;
              if (errorResult !== undefined) {
                setTxError(errorResult.error.message);
              }
            }
          },
        });
        setFinalResults({
          requestKey: pollResult.reqKey,
          status: pollResult.result.status,
        });
      } catch (tx) {
        debug(tx);
        setFinalResults({ ...tx });
      }
    }
  };

  const showInputError =
    pollResults.error === undefined ? undefined : 'negative';
  const showInputInfo = requestKey ? '' : t('(Not a Cross Chain Request Key');
  const showInputHelper =
    pollResults.error !== undefined ? pollResults.error : '';
  const isGasStation = kadenaXChainGas === 'kadena-xchain-gas';
  const formattedGasPrice = gasPrice
    .toFixed(20)
    .replace(/(?<=\.\d*[1-9])0+$|\.0*$/, '');

  const onRequestKeyChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setRequestKey(e.target.value);
    },
    [],
  );

  const onGasPayerAccountChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((e) => {
    setKadenaXChainGas(e.target.value);
  }, []);

  const onGasPriceChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setGasPrice(Number(e.target.value));
    },
    [],
  );

  return (
    <div>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Cross Chain Finisher')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <StyledFinisherContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledAccountForm>
            <StyledToggleContainer>
              <StyledFieldCheckbox>
                <StyledCheckbox
                  type="checkbox"
                  id={'advanced-options'}
                  placeholder={t('Enter private key to sign the transaction')}
                  onChange={() => setAdvancedOptions(!advancedOptions)}
                  value={advancedOptions.toString()}
                />
                <StyledCheckboxLabel htmlFor="advanced-options">
                  {t('Advanced options')}
                </StyledCheckboxLabel>
              </StyledFieldCheckbox>
            </StyledToggleContainer>

            <TextField
              label={t('Request Key')}
              info={showInputInfo}
              status={showInputError}
              helperText={showInputHelper}
              inputProps={{
                id: 'request-key-input',
                placeholder: t('Enter Request Key'),
                onChange: onRequestKeyChange,
                onKeyUp: checkRequestKey,
                defaultValue: requestKey,
              }}
            />

            {advancedOptions ? (
              <>
                <TextField
                  label="Chain Server"
                  inputProps={{
                    id: 'chain-server-input',
                    placeholder: t('Enter Chain Server'),
                    defaultValue: chainNetwork[network].server,
                    leadingText: chainNetwork[network].network,
                  }}
                />
                <TextField
                  label={t('Gas Payer')}
                  helperText={
                    isGasStation
                      ? ''
                      : t('only gas station account is supported')
                  }
                  inputProps={{
                    id: 'gas-payer-account-input',
                    placeholder: t('Enter Your Account'),
                    onChange: onGasPayerAccountChange,
                    defaultValue: kadenaXChainGas,
                  }}
                />
                <TextField
                  label={t('Gas Price')}
                  inputProps={{
                    id: 'gas-price-input',
                    placeholder: t('Enter Gas Price'),
                    onChange: onGasPriceChange,
                    defaultValue: formattedGasPrice,
                  }}
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
                  value: kadenaXChainGas,
                  isAccount: false,
                },
                {
                  label: t('Price'),
                  value: formatNumberAsString(gasPrice),
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
