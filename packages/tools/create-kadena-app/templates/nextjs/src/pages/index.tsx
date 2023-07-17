import Head from 'next/head';
import React, { useState } from 'react';
import { SpinnerRoundFilled } from 'spinners-react';
import { Pact, signWithChainweaver, getClient, ChainId } from '@kadena/client';
import styles from '../styles/main.module.css';

const NETWORK_ID = process.env.NEXT_PUBLIC_KADENA_NETWORK_ID;
const CHAIN_ID = process.env.NEXT_PUBLIC_KADENA_CHAIN_ID as ChainId;

const accountKey = (account: string): string => account.split(':')[1];

const Home: React.FC = (): JSX.Element => {
  const [account, setAccount] = useState<string>('');
  const [messageToWrite, setMessageToWrite] = useState<string>('');
  const [messageFromChain, setMessageFromChain] = useState<string>('');
  const [writeInProgress, setWriteInProgress] = useState<boolean>(false);

  const handleAccountInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setAccount(event.target.value);
  };

  const handleWriteMessageInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setMessageToWrite(event.target.value);
  };

  const writeMessage = async (): Promise<void> => {
    try {
      const client = getClient();

      const transaction = Pact.builder
      .execution(Pact.modules['free.cka-message-store']['write-message'](account, messageToWrite))
      .addSigner(accountKey(account), (withCapability) => [
        withCapability('coin.GAS'),
        withCapability('free.cka-message-store.ACCOUNT-OWNER', account),
      ])
      .setMeta({
          ttl: 28000,
          gasLimit: 100000,
          chainId: CHAIN_ID,
          gasPrice: 0.000001,
          sender: account
        }
      )
      .setNetworkId(NETWORK_ID)
      .createTransaction();

      setWriteInProgress(true);

      console.log(`Signing transaction: ${transaction.cmd}`);
      const signedTransaction = await signWithChainweaver(transaction);

      console.log(`Sending transaction ...`);
      const requestKeys = await client.submit(signedTransaction);
      console.log('Send response: ', requestKeys);

      const pollResult = await client.pollStatus(requestKeys, {
        onPoll: (id: string):void => {
          console.log(`Polling ${id}`);
        },
      });

      console.log('Polling Completed.');
      console.log(pollResult);
    } catch (e) {
      console.log(e);
    }
    setWriteInProgress(false);
  };

  const readMessage = async (): Promise<void> => {
    const client = getClient();
    const unsignedTransaction = Pact.builder
      .execution(Pact.modules['free.cka-message-store']['read-message'](account))
      .setMeta({ chainId: CHAIN_ID })
      .setNetworkId(NETWORK_ID)
      .createTransaction();

    const { result } = await client.local(unsignedTransaction, {
      preflight: false
    });
    if (result.status === 'success') {
      setMessageFromChain(result.data.toString());
    } else {
      console.log(result.error);
    }
  };

  return (
    <div>
      <Head>
        <title>Create Kadena App: Next template</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Welcome to <span>Kadena!</span>
            </h1>
          </div>
          <p>
            This is the Kadena starter template using nextjs to help you get
            started on your blockchain development. Use the form below to
            interact with the Kadena blockchain using{' '}
            <code>@kadena/client</code> and edit{' '}
            <code>src/pages/index.tsx</code> to get started.
          </p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Interact with the blockchain</h3>
          <section className={styles.cardSection}>
            <label htmlFor="account" className={styles.fieldLabel}>
              My Account
            </label>
            <input
              id="account"
              onChange={handleAccountInputChange}
              value={account}
              placeholder="Please enter a valid k:account"
            ></input>
          </section>
          <section className={styles.cardSection}>
            <label htmlFor="write-message" className={styles.fieldLabel}>
              Write Message
            </label>
            <textarea
              id="write-message"
              onChange={handleWriteMessageInputChange}
              value={messageToWrite}
              disabled={writeInProgress}
            ></textarea>
            <button
              onClick={() => writeMessage()}
              disabled={
                account === '' || messageToWrite === '' || writeInProgress
              }
            >
              Write
            </button>
            {writeInProgress && (
              <SpinnerRoundFilled size={30} color="#ed098f" />
            )}
          </section>
          <section className={styles.cardSection}>
            <label htmlFor="read-message" className={styles.fieldLabel}>
              Read Message
            </label>
            <textarea
              id="read-message"
              disabled
              value={messageFromChain}
            ></textarea>
            <button onClick={() => readMessage()} disabled={account === ''}>
              Read
            </button>
          </section>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Resources</h3>
          <a href="https://docs.kadena.io/">
            Find in-depth information about Kadena. &rarr;
          </a>
          <a href="https://github.com/kadena-community/kadena.js/tree/main/packages/tools/create-kadena-app/pact">
            The smart contract powering this page. &rarr;
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
