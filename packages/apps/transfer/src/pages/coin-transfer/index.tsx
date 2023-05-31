import { Button } from '@kadena/react-components';

import {
  StyledAccountForm,
  StyledBack,
  StyledCheckbox,
  StyledCheckboxLabel,
  StyledChevronLeft,
  StyledField,
  StyledFieldCheckbox,
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
  safeTransferCreate,
  transferCreate,
} from '@/services/transfer/coin-transfer';
import React, { FC, useState } from 'react';

const CoinTransfer: FC = () => {
  const NETWORK_ID = 'testnet04';
  const chainId = '1';
  const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${chainId}/pact`;

  const [inputSenderAccount, setSenderAccount] = useState<string>('');
  const [inputReceiverAccount, setReceiverAccount] = useState<string>('');
  const [inputCoinAmount, setCoinAmount] = useState<string>('');
  const [inputPrivateKeySender, setPrivateKeySender] = useState<string>('');
  const [inputSafeTransfer, setSafeTransfer] = useState<boolean>(false);
  const [inputPrivateKeyReceiver, setPrivateKeyReceiver] = useState<string>('');
  const [results, setResults] = useState<TransferResult>({});

  const coinTransfer = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      event.preventDefault();

      const pactCommand = inputSafeTransfer
        ? await safeTransferCreate(
            inputSenderAccount,
            inputReceiverAccount,
            inputCoinAmount,
            inputPrivateKeySender,
            inputPrivateKeyReceiver,
            chainId,
            NETWORK_ID,
          )
        : await transferCreate(
            inputSenderAccount,
            inputReceiverAccount,
            inputCoinAmount,
            inputPrivateKeySender,
            chainId,
            NETWORK_ID,
          );

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
          <StyledForm onSubmit={coinTransfer}>
            <StyledAccountForm>
              <StyledField>
                <StyledInputLabel>Sender Account</StyledInputLabel>

                <StyledInputField
                  type="text"
                  placeholder="Enter account name of the sender"
                  onChange={(e) => setSenderAccount(e.target.value)}
                  value={inputSenderAccount}
                />
              </StyledField>
              <StyledField>
                <StyledInputLabel>Receiver Account</StyledInputLabel>
                <StyledInputField
                  type="text"
                  placeholder="Enter account name of the receiver"
                  onChange={(e) => setReceiverAccount(e.target.value)}
                  value={inputReceiverAccount}
                />
              </StyledField>
              <StyledField>
                <StyledInputLabel>Amount</StyledInputLabel>
                <StyledInputField
                  type="text"
                  placeholder="Enter amount to transfer"
                  onChange={(e) => setCoinAmount(e.target.value)}
                  value={inputCoinAmount}
                />
              </StyledField>
              <StyledField>
                <StyledInputLabel>Sender Sign</StyledInputLabel>
                <StyledInputField
                  type="text"
                  placeholder="Enter private key to sign the transaction"
                  onChange={(e) => setPrivateKeySender(e.target.value)}
                  value={inputPrivateKeySender}
                />
              </StyledField>

              <StyledFieldCheckbox>
                <StyledCheckbox
                  type="checkbox"
                  id={'safe-transfer'}
                  placeholder="Enter private key to sign the transaction"
                  onChange={(e) => setSafeTransfer(!inputSafeTransfer)}
                  value={inputSafeTransfer.toString()}
                />
                <StyledCheckboxLabel htmlFor="safe-transfer">
                  Safe Transfer
                </StyledCheckboxLabel>
              </StyledFieldCheckbox>

              {inputSafeTransfer ? (
                <StyledField>
                  <StyledInputLabel>Receiver Sign</StyledInputLabel>
                  <StyledInputField
                    type="text"
                    placeholder="Enter receiver's private key to sign the transaction"
                    onChange={(e) => setPrivateKeyReceiver(e.target.value)}
                    value={inputPrivateKeyReceiver}
                  />
                </StyledField>
              ) : null}
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
