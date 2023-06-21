import { ChainwebNetworkId, poll, spv } from '@kadena/chainweb-node-client';
import { ContCommand } from '@kadena/client';
import { Button, TextField } from '@kadena/react-components';
import { ChainId } from '@kadena/types';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { SidebarMenu } from '@/components/Global';
import { kadenaConstants } from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import { useAppContext } from '@/context/app-context';
import {
  StyledAccountForm,
  StyledCheckbox,
  StyledCheckboxLabel,
  StyledErrorMessage,
  StyledFieldCheckbox,
  StyledForm,
  StyledFormButton,
  StyledInfoBox,
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
  StyledInfoTitle,
  StyledMainContent,
  StyledResultContainer,
  StyledShowMore,
  StyledToggleContainer,
  StyledTotalChunk,
  StyledTotalContainer,
} from '@/pages/transfer/cross-chain-transfer-finisher/styles';
import {
  finishXChainTransfer,
  TransferResult,
} from '@/services/cross-chain-transfer-finish/finish-xchain-transfer';
import {
  getTransferData,
  ITransferDataResult,
} from '@/services/cross-chain-transfer-finish/get-transfer-data';
import { generateApiHost } from '@/services/utils/utils';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useState } from 'react';

const CrossChainTransferFinisher: FC = () => {
  const { t } = useTranslation('common');
  const { network } = useAppContext();

  const [requestKey, setRequestKey] = useState<string>('');
  const [kadenaXChainGas, setKadenaXChainGas] =
    useState<string>('kadena-xchain-gas');
  const [gasPrice, setGasPrice] = useState<number>(0.00000001);
  const [gasLimit, setGasLimit] = useState<number>(kadenaConstants.GAS_LIMIT);
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const [pollResults, setPollResults] = useState<ITransferDataResult>({});

  const [finalResults, setFinalResults] = useState<TransferResult>({});
  const [txError, setTxError] = useState('');

  const onBlurRequestKey = async (
    e: React.FocusEvent<HTMLInputElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!requestKey) {
      return;
    }

    setTxError('');

    const pollResult: ITransferDataResult | undefined = await getTransferData({
      requestKey,
      server: chainNetwork[network].server,
      networkId: chainNetwork[network].network as ChainwebNetworkId,
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

    if (!pollResults.tx) {
      return;
    }

    const host = generateApiHost(
      chainNetwork[network].server,
      chainNetwork[network].network,
      pollResults.tx.receiver.chain,
    );

    const contCommand = await finishXChainTransfer(
      requestKey,
      pollResults.tx.step,
      pollResults.tx.pactId,
      pollResults.tx.rollback,
      chainNetwork[network].server,
      chainNetwork[network].network as ChainwebNetworkId,
      pollResults.tx.receiver.chain as ChainId,
      kadenaXChainGas,
    );

    if (!(contCommand instanceof ContCommand) && contCommand.error) {
      setTxError(contCommand.error);
    }

    if (contCommand instanceof ContCommand) {
      const pollResult = await contCommand.pollUntil(host, {
        onPoll: async (transaction, pollRequest): Promise<void> => {
          console.log(`Polling ${requestKey}.\nStatus: ${transaction.status}`);
          setFinalResults({ ...transaction });
          console.log(await pollRequest);
        },
      });
      setFinalResults({ ...pollResult } as TransferResult);
    }
  };

  const showInputError = pollResults.error === undefined ? undefined : 'error';

  const showInputInfo = requestKey ? '' : t('(Not a Cross Chain Request Key');

  const showInputHelper =
    pollResults.error !== undefined ? pollResults.error : '';

  return (
    <MainLayout title={t('Kadena Cross Chain Transfer Finisher')}>
      <StyledMainContent>
        <SidebarMenu />

        <StyledForm onSubmit={handleSubmit}>
          <StyledAccountForm>
            <StyledToggleContainer>
              <StyledFieldCheckbox>
                <StyledCheckbox
                  type="checkbox"
                  id={'advanced-options'}
                  placeholder={t('Enter private key to sign the transaction')}
                  onChange={(e) => setAdvancedOptions(!advancedOptions)}
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
              helper={showInputHelper}
              inputProps={{
                placeholder: t('Enter Request Key'),
                onChange: (e) =>
                  setRequestKey((e.target as HTMLInputElement).value),
                onBlur: onBlurRequestKey,
                value: requestKey,
              }}
            />

            {advancedOptions ? (
              <>
                <TextField
                  label="Chain Server"
                  inputProps={{
                    placeholder: t('Enter Chain Server'),
                    defaultValue: chainNetwork[network].server,
                    leadingText: chainNetwork[network].network,
                  }}
                />
                <TextField
                  label={t('Gas Payer Account')}
                  helper={t('only single pubkey accounts are supported')}
                  inputProps={{
                    placeholder: t('Enter Your Account'),
                    onChange: (e) =>
                      setKadenaXChainGas((e.target as HTMLInputElement).value),
                    value: kadenaXChainGas,
                  }}
                />
                <TextField
                  label={t('Gas Price')}
                  inputProps={{
                    placeholder: t('Enter Gas Payer'),
                    onChange: (e) =>
                      setGasPrice(Number((e.target as HTMLInputElement).value)),
                    value: gasPrice,
                  }}
                />
              </>
            ) : null}
          </StyledAccountForm>
          <StyledFormButton>
            <Button title={t('Finish Cross Chain Transfer')}>
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
            <StyledInfoItem>
              <StyledInfoItemTitle>{t('Sender')}</StyledInfoItemTitle>
              <StyledInfoItemLine>{`Chain: ${pollResults.tx.sender.chain}`}</StyledInfoItemLine>
              <StyledInfoItemLine>{`Account: ${pollResults.tx.sender.account}`}</StyledInfoItemLine>
            </StyledInfoItem>

            <StyledInfoItem>
              <StyledInfoItemTitle>{t('Receiver')}</StyledInfoItemTitle>
              <StyledInfoItemLine>{`Chain: ${pollResults.tx.receiver.chain}`}</StyledInfoItemLine>
              <StyledInfoItemLine>{`Account: ${pollResults.tx.receiver.account}`}</StyledInfoItemLine>
            </StyledInfoItem>

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
      </StyledMainContent>
    </MainLayout>
  );
};

export default CrossChainTransferFinisher;
