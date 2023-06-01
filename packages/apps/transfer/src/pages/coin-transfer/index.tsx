import { Button } from '@kadena/react-components';

import { StyledOption, StyledSelect } from '@/components/Global/Select/styles';
import {
  StyledAccountForm,
  StyledBack,
  StyledChainContainer,
  StyledChevronLeft,
  StyledField,
  StyledForm,
  StyledFormButton,
  StyledFormContainer,
  StyledHeaderContainer,
  StyledHeaderLogoWalletContent,
  StyledHeaderText,
  StyledIconImage,
  StyledInputField,
  StyledInputLabel,
  StyledKadenaTransferWrapper,
  StyledLogoTextContainer,
  StyledMainContent,
  StyledResultContainer,
  StyledTextBold,
  StyledTextNormal,
  StyledTitle,
  StyledTitleContainer,
  StyledTotalChunk,
  StyledTotalContainer,
  StyledWalletNotConnected,
} from '@/pages/coin-transfer/styles';
import { KLogoComponent } from '@/resources/svg/generated';
import {
  type TransferResult,
  coinTransfer,
} from '@/services/transfer/coin-transfer';
import { convertIntToChainId } from '@/services/utils/utils';
import React, { FC, useState } from 'react';

const CoinTransfer: FC = () => {
  const NETWORK_ID = 'testnet04';
  const chainId = '1';
  const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${chainId}/pact`;
  const numberOfChains = 20;

  const [senderAccount, setSenderAccount] = useState<string>('');
  const [receiverAccount, setReceiverAccount] = useState<string>('');
  const [coinAmount, setCoinAmount] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [senderChain, setSenderChain] = useState<number>(1);
  const [receiverChain, setReceiverChain] = useState<number>(1);
  const [results, setResults] = useState<TransferResult>({});

  const handleTransfer = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      event.preventDefault();

      const pactCommand = await coinTransfer({
        fromAccount: senderAccount,
        fromChainId: convertIntToChainId(senderChain),
        toAccount: receiverAccount,
        toChainId: convertIntToChainId(receiverChain),
        amount: coinAmount,
        fromPrivateKey: privateKey,
        networkId: NETWORK_ID,
      });

      const requestKey = pactCommand.requestKey;

      const pollResult = await pactCommand.pollUntil(API_HOST, {
        onPoll: async (transaction, pollRequest): Promise<void> => {
          console.log(`Polling ${requestKey}.\nStatus: ${transaction.status}`);
          setResults({ ...transaction });
          console.log(await pollRequest);
        },
      });

      setResults({ ...pollResult });
    } catch (e) {
      console.log(e);
      if (e.statsus || e.requestKey) {
        setResults({ ...e });
        return;
      }
      setResults({ requestKey: 'Could not create request', status: e.message });
    }
  };

  const renderChainOptions = (): JSX.Element[] => {
    const options = [];
    for (let i = 0; i < numberOfChains; i++) {
      options.push(
        <StyledOption value={i} key={i}>
          Chain {i}
        </StyledOption>,
      );
    }
    return options;
  };

  return (
    <StyledKadenaTransferWrapper>
      <StyledHeaderContainer>
        <StyledHeaderLogoWalletContent>
          <StyledLogoTextContainer>
            <KLogoComponent width="100px" />
            <StyledHeaderText>
              <StyledTextBold>K:Transfer</StyledTextBold>
              <StyledTextNormal>Kadena Testnet</StyledTextNormal>
            </StyledHeaderText>
          </StyledLogoTextContainer>
          <StyledWalletNotConnected>
            <p>Connect your wallet</p>
            <StyledIconImage width={'40px'} height={'40px'} />
          </StyledWalletNotConnected>
        </StyledHeaderLogoWalletContent>

        <StyledTitleContainer>
          <StyledBack href={'/'}>
            <StyledChevronLeft width={'20px'} height={'20px'} />
            <span>Back</span>
          </StyledBack>
          <StyledTitle>Kadena Coin Transfer</StyledTitle>
        </StyledTitleContainer>
      </StyledHeaderContainer>

      <StyledMainContent>
        <StyledFormContainer>
          <StyledForm onSubmit={handleTransfer}>
            <StyledAccountForm>
              <StyledField>
                <StyledInputLabel>Sender Account</StyledInputLabel>

                <StyledInputField
                  type="text"
                  id="server"
                  placeholder="Enter account name of the sender"
                  onChange={(e) => setSenderAccount(e.target.value)}
                  value={senderAccount}
                />
              </StyledField>
              <StyledTotalChunk>
                <StyledChainContainer>
                  <StyledInputLabel>Sender Chain</StyledInputLabel>
                  <StyledSelect
                    value={senderChain}
                    onChange={(e) => setSenderChain(parseInt(e.target.value))}
                  >
                    {renderChainOptions()}
                  </StyledSelect>
                </StyledChainContainer>
              </StyledTotalChunk>
              <StyledField>
                <StyledInputLabel>Receiver Account</StyledInputLabel>
                <StyledInputField
                  type="text"
                  id="server"
                  placeholder="Enter account name of the receiver"
                  onChange={(e) => setReceiverAccount(e.target.value)}
                  value={receiverAccount}
                />
              </StyledField>
              <StyledChainContainer>
                <StyledInputLabel>Receiver Chain</StyledInputLabel>
                <StyledSelect
                  value={receiverChain}
                  onChange={(e) => setReceiverChain(parseInt(e.target.value))}
                >
                  {renderChainOptions()}
                </StyledSelect>
              </StyledChainContainer>
              <StyledField>
                <StyledInputLabel>Amount</StyledInputLabel>
                <StyledInputField
                  type="text"
                  id="server"
                  placeholder="Enter amount to transfer"
                  onChange={(e) => setCoinAmount(e.target.value)}
                  value={coinAmount}
                />
              </StyledField>
              <StyledField>
                <StyledInputLabel>Sign</StyledInputLabel>
                <StyledInputField
                  type="text"
                  id="server"
                  placeholder="Enter private key to sign the transaction"
                  onChange={(e) => setPrivateKey(e.target.value)}
                  value={privateKey}
                />
              </StyledField>
            </StyledAccountForm>
            <StyledFormButton>
              <Button title="Make Transfer">Make Transfer</Button>
            </StyledFormButton>
          </StyledForm>
        </StyledFormContainer>

        {Object.keys(results).length > 0 ? (
          <StyledResultContainer>
            <StyledTotalContainer>
              <StyledTotalChunk>
                <p>Request Key</p>
                <p>{results.requestKey}</p>
              </StyledTotalChunk>
              <StyledTotalChunk>
                <p>Status</p>
                <p>{results.status}</p>
              </StyledTotalChunk>
            </StyledTotalContainer>
          </StyledResultContainer>
        ) : null}
      </StyledMainContent>
    </StyledKadenaTransferWrapper>
  );
};

export default CoinTransfer;
