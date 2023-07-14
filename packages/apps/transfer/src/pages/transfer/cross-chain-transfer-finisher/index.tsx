import { IPollResponse } from '@kadena/chainweb-node-client';
import { ContCommand } from '@kadena/client';
import { Button, TextField } from '@kadena/react-ui';
import MainLayout from '@/components/Common/Layout/MainLayout';
import { DetailCard } from '@/components/Global/DetailsCard';
import { getKadenaConstantByNetwork } from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import { useAppContext } from '@/context/app-context';
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
} from '@/pages/transfer/cross-chain-transfer-finisher/styles';
import { FromIconActive, ReceiverIconActive } from '@/resources/svg/generated';
import {
  finishXChainTransfer,
  ITransferResult,
} from '@/services/cross-chain-transfer-finish/finish-xchain-transfer';
import {
  getTransferData,
  ITransferDataResult,
} from '@/services/cross-chain-transfer-finish/get-transfer-data';
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';

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

  return (
    <MainLayout title={t('Kadena Cross Chain Transfer Finisher')}>
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
                onChange: (e) =>
                  setRequestKey((e.target as HTMLInputElement).value),
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
                  label={t('Gas Payer Account')}
                  helperText={
                    isGasStation
                      ? ''
                      : t('only gas station account is supported')
                  }
                  inputProps={{
                    id: 'gas-payer-account-input',
                    placeholder: t('Enter Your Account'),
                    onChange: (e) =>
                      setKadenaXChainGas((e.target as HTMLInputElement).value),
                    defaultValue: kadenaXChainGas,
                  }}
                />
                <TextField
                  label={t('Gas Price')}
                  inputProps={{
                    id: 'gas-price-input',
                    placeholder: t('Enter Gas Price'),
                    onChange: (e) =>
                      setGasPrice(Number((e.target as HTMLInputElement).value)),
                    defaultValue: formattedGasPrice,
                  }}
                />
              </>
            ) : null}
          </StyledAccountForm>
          <StyledFormButton>
            <Button.Root
              title={t('Finish Cross Chain Transfer')}
              disabled={!isGasStation}
            >
              {t('Finish Cross Chain Transfer')}
            </Button.Root>
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

            <DetailCard
              firstTitle={t('Sender')}
              firstContent={pollResults.tx.sender.account}
              secondTitle={t('Chain')}
              secondContent={pollResults.tx.sender.chain}
              icon={<FromIconActive />}
            />

            <DetailCard
              firstTitle={t('Receiver')}
              firstContent={pollResults.tx.receiver.account}
              secondTitle={t('Chain')}
              secondContent={pollResults.tx.receiver.chain}
              icon={<ReceiverIconActive />}
            />

            <StyledInfoItem>
              <StyledInfoItemTitle>{t('Amount')}</StyledInfoItemTitle>
              <StyledInfoItemLine>{`${pollResults.tx.amount} ${t(
                'KDA',
              )}`}</StyledInfoItemLine>
            </StyledInfoItem>

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
    </MainLayout>
  );
};

export default CrossChainTransferFinisher;
