import readMessage from '@/utils/readMessage';
import writeMessage from '@/utils/writeMessage';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';
import { SpinnerRoundFilled } from 'spinners-react';
import KadenaImage from '../../public/assets/k-community-icon.png';
import styles from '../styles/main.module.css';

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

  async function handleWriteMessageClick() {
    setWriteInProgress(true);
    try {
      await writeMessage({ account, messageToWrite });
      setMessageToWrite('');
    } catch (e) {
      console.log(e);
    } finally {
      setWriteInProgress(false);
    }
  }

  async function handleReadMessageClick() {
    try {
      const message = await readMessage({ account });
      setMessageFromChain(message);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Head>
        <title>Create Kadena App: Next template</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={styles.grid}>
        <section className={styles.headerWrapper}>
          <div className={styles.header}>
            <Image
              src={KadenaImage}
              alt="Kadena Community Logo"
              className={styles.logo}
            />
            <h1 className={styles.title}>
              Start Interacting with the Kadena Blockchain
            </h1>
            <p className={styles.note}>
              This is the Kadena starter template using <strong>NextJS</strong>
              &nbsp; to help you get started on your blockchain development.
            </p>
            <p className={styles.note}>
              Use the form below to interact with the Kadena blockchain
              using&nbsp;
              <code>@kadena/client</code> and edit&nbsp;
              <code>src/pages/index.tsx</code> to get started.
            </p>
          </div>
        </section>
        <section className={styles.contentWrapper}>
          <div className={styles.blockChain}>
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Write to the blockchain</h4>
              <fieldset className={styles.fieldset}>
                <label htmlFor="account" className={styles.fieldLabel}>
                  My Account
                </label>
                <input
                  id="account"
                  onChange={handleAccountInputChange}
                  value={account}
                  placeholder="Please enter a valid k:account"
                  className={`${styles.input} ${styles.codeFont}`}
                ></input>
              </fieldset>
              <fieldset className={styles.fieldset}>
                <label htmlFor="write-message" className={styles.fieldLabel}>
                  Write Message
                </label>
                <textarea
                  id="write-message"
                  onChange={handleWriteMessageInputChange}
                  value={messageToWrite}
                  disabled={writeInProgress}
                  className={styles.input}
                ></textarea>
              </fieldset>
              <div className={styles.buttonWrapper}>
                {writeInProgress && (
                  <SpinnerRoundFilled size={36} color="#ed098f" />
                )}
                <button
                  onClick={handleWriteMessageClick}
                  disabled={
                    account === '' || messageToWrite === '' || writeInProgress
                  }
                  className={styles.button}
                >
                  Write
                </button>
              </div>
            </div>
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Read from the blockchain</h4>
              <fieldset className={styles.fieldset}>
                <label htmlFor="read-message" className={styles.fieldLabel}>
                  Read Message
                </label>
                <textarea
                  id="read-message"
                  disabled
                  value={messageFromChain}
                  className={styles.input}
                ></textarea>
              </fieldset>
              <div className={styles.buttonWrapper}>
                <button
                  onClick={handleReadMessageClick}
                  disabled={account === ''}
                  className={styles.button}
                >
                  Read
                </button>
              </div>
            </div>
          </div>
          <div className={styles.helperSection}>
            <div className={`${styles.card} ${styles.noBackground}`}>
              <h4 className={styles.cardTitle}>Resources</h4>
              <ul className={styles.list}>
                <li>
                  <a className={styles.link} href="https://docs.kadena.io/">
                    Find in-depth information about Kadena. &rarr;
                  </a>
                </li>
                <li>
                  <a
                    className={styles.link}
                    href="https://github.com/kadena-community/kadena.js/tree/main/packages/tools/create-kadena-app/pact"
                  >
                    The smart contract powering this page. &rarr;
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
