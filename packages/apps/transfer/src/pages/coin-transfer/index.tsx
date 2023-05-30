import { Button, TextField } from '@kadena/react-components';

import MainLayout from '@/components/Common/Layout/MainLayout';
import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledFormContainer,
  StyledMainContent,
  StyledResultContainer,
  StyledTotalChunk,
  StyledTotalContainer,
} from '@/pages/coin-transfer/styles';
import {
  type TransferResult,
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
  const [inputPrivateKey, setPrivateKey] = useState<string>('');
  const [results, setResults] = useState<TransferResult>({});

  const coinTransfer = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      event.preventDefault();

      const pactCommand = await transferCreate(
        inputSenderAccount,
        inputReceiverAccount,
        inputCoinAmount,
        inputPrivateKey,
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
    <MainLayout title="Kadena Coin Transfer">
      <StyledMainContent>
        <StyledFormContainer>
          <StyledForm onSubmit={coinTransfer}>
            <StyledAccountForm>
              <TextField
                label="Sender Account"
                inputProps={{
                  placeholder: 'Enter account name of the sender',
                  // @ts-ignore
                  onChange: (e) => setSenderAccount(e?.target?.value),
                  value: inputSenderAccount,
                }}
              />
              <TextField
                label="Receiver Account"
                inputProps={{
                  placeholder: 'Enter account name of the receiver',
                  // @ts-ignore
                  onChange: (e) => setReceiverAccount(e?.target?.value),
                  value: inputReceiverAccount,
                }}
              />
              <TextField
                label="Amount"
                inputProps={{
                  placeholder: 'Enter amount to transfer',
                  // @ts-ignore
                  onChange: (e) => setCoinAmount(e?.target?.value),
                  value: inputCoinAmount,
                }}
              />
              <TextField
                label="Sign"
                inputProps={{
                  placeholder: 'Enter private key to sign the transaction',
                  // @ts-ignore
                  onChange: (e) => setPrivateKey(e?.target?.value),
                  value: inputPrivateKey,
                }}
              />
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
    </MainLayout>
  );
};

export default CoinTransfer;
