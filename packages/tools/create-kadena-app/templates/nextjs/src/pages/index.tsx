import readMessage from '@/utils/readMessage';
import writeMessage from '@/utils/writeMessage';
import { useKadenaWallet } from '@kadena/wallet-adapter-react';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { SpinnerRoundFilled } from 'spinners-react';
import KadenaImage from '../../public/assets/k-community-icon.png';
import styles from '../styles/main.module.css';

const AccountModal = ({
  accounts,
  onSelect,
  onClose,
}: {
  accounts: any[];
  onSelect: (account: any) => void;
  onClose: () => void;
}) => {
  const filteredAccounts = accounts.filter((acc) => acc.accountName.startsWith("k:"));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Select an Account</h3>
        <div style={{ maxHeight: "300px", overflowY: "auto", margin: "1rem 0" }}>
          {filteredAccounts.map((acc) => (
            <button
              key={acc.accountName}
              onClick={() => {
                onSelect(acc);
                onClose();
              }}
              className={styles.button}
              style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}
            >
              {acc.accountName}
            </button>
          ))}
        </div>
        <button onClick={onClose} className={styles.button}>
          Close
        </button>
      </div>
    </div>
  );
};

const Home: React.FC = (): JSX.Element => {
  const { client, providerData } = useKadenaWallet();
  const [account, setAccount] = useState<string>('');
  const [network, setNetwork] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [messageToWrite, setMessageToWrite] = useState<string>('');
  const [messageFromChain, setMessageFromChain] = useState<string>('');
  const [writeInProgress, setWriteInProgress] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // State for handling Zelcore account modal
  const [zelcoreAccounts, setZelcoreAccounts] = useState<any[]>([]);
  const [isZelcoreModalOpen, setIsZelcoreModalOpen] = useState<boolean>(false);

  const handleConnect = async () => {
    if (!selectedWallet) {
      console.error("No wallet selected");
      return;
    }
    if (!client) {
      console.error("Wallet client not available");
      return;
    }
    setLoading(true);
    try {
      if (selectedWallet === "Zelcore") {
        const accounts = await client.getAccounts("Zelcore");

        if (!accounts || accounts.length === 0) {
          throw new Error("No Zelcore accounts found");
        }

        // Open the modal with the list of accounts
        setZelcoreAccounts(accounts);
        setIsZelcoreModalOpen(true);
        setLoading(false);
        return;
      } else {
        const accountInfo = await client.connect(
          selectedWallet,
          selectedWallet === "Chainweaver"
            ? {
                accountName: prompt("Input your account"),
                tokenContract: "coin",
                chainIds: ["0", "1"],
              }
            : undefined,
        );
        setAccount(accountInfo.accountName);

        const networkInfo = await client.getActiveNetwork(selectedWallet);
        setNetwork(networkInfo);

        console.log("Connected to", selectedWallet, "->", accountInfo?.accountName);
      }
    } catch (error) {
      console.error("Connect error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Callback when an account is selected in the modal (for Zelcore)
  const handleZelcoreAccountSelect = async (selectedAccount: any) => {
    if (!client) {
      console.error("Wallet client not available");
      return;
    }
    try {
      setLoading(true);
      const accountInfo = await client.connect("Zelcore", {
        accountName: selectedAccount.accountName,
        tokenContract: selectedAccount.contract || "coin",
        chainIds: ["0", "1"], // Update as needed
      });
      setAccount(accountInfo.accountName);

      const networkInfo = await client.getActiveNetwork("Zelcore");
      setNetwork(networkInfo);

      console.log("Connected to Zelcore ->", selectedAccount.accountName);

      // Close the modal when an account is selected
      setIsZelcoreModalOpen(false);
      setZelcoreAccounts([]);
    } catch (error) {
      console.error("Connect error:", error);
    } finally {
      setLoading(false);
    }
  };

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
      await writeMessage({
        account: account,
        messageToWrite,
        walletClient: client,
        walletName: selectedWallet,
      });
      setMessageToWrite('');
    } catch (e) {
      console.log(e);
    } finally {
      setWriteInProgress(false);
    }
  }

  // Listen for account & network changes
  useEffect(() => {
    if (!selectedWallet || !client) return;

    if (client.isDetected(selectedWallet)) {
      client.onAccountChange(selectedWallet, (newAccount) => {
        console.log("Account changed:", newAccount);
        setAccount(newAccount?.accountName || '');
      });

      client.onNetworkChange(selectedWallet, (newNetwork) => {
        console.log("Network changed:", newNetwork);
        setNetwork(newNetwork);
      });
    }
  }, [selectedWallet, client]);

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
        <link rel="icon" href="/favicon.ico" />
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
          <div className={styles.card}>
            <h4 className={styles.cardTitle}>Wallet</h4>

            <fieldset className={styles.fieldset}>
              <label htmlFor="wallet-select" className={styles.fieldLabel}>
                Select Wallet
              </label>
              <select
                id="wallet-select"
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className={styles.input}
              >
                <option value="">-- select a wallet --</option>
                {providerData.map((pd) => (
                  <option key={pd.name} value={pd.name}>
                    {pd.name} {pd.detected ? '(Detected)' : '(Not found)'}
                  </option>
                ))}
              </select>
            </fieldset>

            <div className={styles.buttonWrapper} style={{ marginTop: 8 }}>
              <button
                onClick={handleConnect}
                disabled={loading || !selectedWallet || !!account}
                className={styles.button}
              >
                {loading ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>

            <fieldset className={styles.fieldset} style={{ marginTop: 12 }}>
              <label htmlFor="account" className={styles.fieldLabel}>
                Connected Account
              </label>
              <textarea
                id="account"
                value={account}
                readOnly
                style={{ overflow: 'hidden', resize: 'none' }}
                className={`${styles.input} ${styles.codeFont}`}
              />
            </fieldset>
          </div>
        </section>

        <section className={styles.contentWrapper}>
          <div className={styles.blockChain}>
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Write to the blockchain</h4>
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
                    account === '' || 
                    messageToWrite === '' || 
                    writeInProgress || 
                    selectedWallet === ''
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

      {/* Render the Zelcore Account Modal when open */}
      {isZelcoreModalOpen && (
        <AccountModal
          accounts={zelcoreAccounts}
          onSelect={handleZelcoreAccountSelect}
          onClose={() => setIsZelcoreModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
