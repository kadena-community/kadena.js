import { ChainwebNetworkId, poll, spv } from '@kadena/chainweb-node-client';
import {
  ContCommand,
  getContCommand,
  PactCommand,
  pollSpvProof,
} from '@kadena/client';
import { Button, TextField } from '@kadena/react-components';
import { ChainId } from '@kadena/types';

import { finishXChainTransfer } from '../../../services/cross-chain-transfer-finish/finish-xchain-transfer';
import {
  getSpvProof,
  getTransferData,
  ISpvProofResult,
  ITransferDataResult,
} from '../../../services/cross-chain-transfer-finish/get-transfer-data';
import { generateApiHost } from '../../../services/utils/utils';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { SidebarMenu } from '@/components/Global';
import { useAppContext } from '@/context/app-context';
import {
  StyledAccountForm,
  StyledCheckbox,
  StyledCheckboxLabel,
  StyledFieldCheckbox,
  StyledForm,
  StyledFormButton,
  StyledInfoBox,
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
  StyledInfoTitle,
  StyledMainContent,
  StyledShowMore,
  StyledSideContent,
  StyledToggleContainer,
} from '@/pages/transfer/cross-chain-transfer-finisher/styles';
import * as net from 'net';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useState } from 'react';

const CrossChainTransferFinisher: FC = () => {
  const { t } = useTranslation('common');
  const { network } = useAppContext();

  const chainNetwork: {
    Mainnet: { server: string; network: string };
    Testnet: { server: string; network: string };
  } = {
    Mainnet: {
      server: 'api.chainweb.com',
      network: 'mainnet01',
    },
    Testnet: {
      server: 'api.testnet.chainweb.com',
      network: 'testnet04',
    },
  };

  const [requestKey, setRequestKey] = useState<string>('');
  const [kadenaXChainGas, setKadenaXChainGas] =
    useState<string>('kadena-xchain-gas');
  const [gasPrice, setGasPrice] = useState<string>('0.00000001');
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const [pollResults, setPollResults] = useState<ITransferDataResult>({});

  const [spvProofResults, setSpvProofResults] = useState<ISpvProofResult>({});

  const [finalResulsts, setFinalResults] = useState({});

  const onBlurRequestKey = async (
    e: React.FocusEvent<HTMLInputElement>,
  ): Promise<void> => {
    e.preventDefault();

    console.log(requestKey);
    if (!requestKey) {
      return;
    }

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
    console.log('POLLL RESULTS', pollResult);
    if (pollResults.tx === undefined) {
      return;
    }

    // MY SPV PROOF
    const spvProof2 = await getSpvProof({
      requestKey,
      chainId: pollResults.tx.sender.chain,
      networkId: chainNetwork[network].network as ChainwebNetworkId,
      server: chainNetwork[network].server,
      t,
    });
    console.log('proooooooof', spvProof2.proof);
    setSpvProofResults(spvProof2);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!pollResults.tx || !spvProofResults.proof) {
      return;
    }
    const host = `https://${chainNetwork[network].server}/chainweb/0.0/${chainNetwork[network].network}/chain/${pollResults.tx.receiver.chain}/pact/api/v1/local`;
    const constCommand = await finishXChainTransfer(
      requestKey,
      spvProofResults.proof,
      pollResults.tx.step,
      pollResults.tx.pactId,
      pollResults.tx.rollback,
      chainNetwork[network].server,
      chainNetwork[network].network as ChainwebNetworkId,
      pollResults.tx.receiver.chain as ChainId,
    );

    console.log('finishResult', constCommand);

    // const pollResult = await constCommand.pollUntil(host, {
    //   onPoll: async (transaction, pollRequest): Promise<void> => {
    //     console.log(`Polling ${requestKey}.\nStatus: ${transaction.status}`);
    //     setFinalResults({ ...transaction });
    //     console.log(await pollRequest);
    //   },
    // });
    // setFinalResults({ ...pollResult });

    console.log('submitted');
  };

  const showInputError =
    pollResults.error === undefined || spvProofResults.error === undefined
      ? undefined
      : 'error';

  const showInputInfo = requestKey ? '' : t('(Not a Cross Chain Request Key');

  const showInputHelper =
    pollResults.error !== undefined
      ? pollResults.error
      : spvProofResults.error !== undefined
      ? spvProofResults.error
      : '';

  return (
    <MainLayout title={t('Kadena Cross Chain Transfer Finisher')}>
      <StyledMainContent>
        <StyledSideContent>
          <SidebarMenu />

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
                  <StyledInfoItemTitle>
                    {t('Receiver guard')}
                  </StyledInfoItemTitle>
                  <StyledInfoItemLine>{`${t('Pred')}: ${
                    pollResults.tx.receiverGuard.pred
                  }`}</StyledInfoItemLine>
                  <StyledInfoItemLine>
                    `${t('Keys')}: $
                    {pollResults.tx.receiverGuard.keys.map((key, index) => (
                      <span key={index}>{key}</span>
                    ))}
                    `
                  </StyledInfoItemLine>
                </StyledInfoItem>
              ) : null}

              <StyledShowMore onClick={() => setShowMore(!showMore)}>
                {!showMore ? t('Show more') : t('Show less')}
              </StyledShowMore>
            </StyledInfoBox>
          ) : null}
        </StyledSideContent>

        <StyledForm onSubmit={handleSubmit}>
          <StyledAccountForm>
            <StyledToggleContainer>
              <StyledFieldCheckbox>
                <StyledCheckbox
                  type="checkbox"
                  id={'advanced-options'}
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
                      setGasPrice((e.target as HTMLInputElement).value),
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
        </StyledForm>
      </StyledMainContent>
    </MainLayout>
  );
};

export default CrossChainTransferFinisher;
