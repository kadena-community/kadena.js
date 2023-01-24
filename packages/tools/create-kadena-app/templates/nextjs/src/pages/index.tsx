import Head from 'next/head'
import React, { useState } from 'react'
import { SpinnerRoundFilled } from 'spinners-react'
import { Pact, signWithChainweaver } from '@kadena/client'
import styles from '../styles/main.module.css'

const NETWORK_ID = 'testnet04'
const CHAIN_ID = '0'
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`

const accountKey = (account: string): string => account.split(':')[1]

const Home: React.FC = (): JSX.Element => {
  const [account, setAccount] = useState<string>('')
  const [messageToWrite, setMessageToWrite] = useState<string>('')
  const [messageFromChain, setMessageFromChain] = useState<string>('')
  const [writeInProgress, setWriteInProgress] = useState<boolean>(false)

  const handleAccountInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setAccount(event.target.value)
  }

  const handleWriteMessageInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessageToWrite(event.target.value)
  }

  const writeMessage = async (): Promise<void> => {
    try {
      const transactionBuilder = Pact.modules['free.cka-message-store']['write-message'](account, messageToWrite)
      .addCap('coin.GAS', accountKey(account))
      .addCap('free.cka-message-store.ACCOUNT-OWNER' , accountKey(account), account)
      .setMeta({
        ttl: 28000,
        gasLimit: 100000,
        chainId: CHAIN_ID,
        gasPrice: 0.000001,
        sender: account,
      }, NETWORK_ID)

      setWriteInProgress(true)

      await signWithChainweaver(transactionBuilder)

      console.log(`Sending transaction: ${transactionBuilder.code}`)
      const response = await transactionBuilder.send(API_HOST);

      console.log('Send response: ', response);
      const requestKey = response.requestKeys[0];

      const pollResult = await transactionBuilder.pollUntil(API_HOST, {
        onPoll: async (transaction, pollRequest): Promise<void> => {
          console.log(
            `Polling ${requestKey}.\nStatus: ${transaction.status}`,
          );
          console.log(await pollRequest);
        },
      })

      console.log('Polling Completed.')
      console.log(pollResult)
    } catch (e) {
      console.log(e)
    }
    setWriteInProgress(false)
  }

  const readMessage = async (): Promise<void> => {
    const transactionBuilder = Pact.modules['free.cka-message-store']['read-message'](account)
    const { result } = await transactionBuilder.local(API_HOST)

    if (result.status === 'success') {
      setMessageFromChain(result.data.toString())
    } else {
      console.log(result.error)
    }
  }

  return (
    <div>
       <Head>
        <title>Create Kadena App: Next template</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome to <span>Kadena!</span></h1>
          </div>
          <p>This is the Kadena starter template using nextjs to help you get started on your blockchain development. Use the form below
            to interact with the Kadena blockchain using <code>@kadena/client</code> and edit <code>src/pages/index.tsx</code> to get started.</p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Interact with the blockchain</h3>
          <section className={styles.cardSection}>
            <h4>My Account</h4>
            <input onChange={handleAccountInputChange} value={account} placeholder="Please enter a valid k:account"></input>
          </section>
          <section className={styles.cardSection}>
            <h4>Write Message</h4>
            <textarea onChange={handleWriteMessageInputChange} value={messageToWrite} disabled={writeInProgress}></textarea>
            <button onClick={() => writeMessage()} disabled={messageToWrite === '' || writeInProgress}>Write</button>
            {writeInProgress && <SpinnerRoundFilled size={30} color="#ed098f" />}
          </section>
          <section className={styles.cardSection}>
            <h4>Read Message</h4>
            <textarea disabled value={messageFromChain}></textarea>
            <button onClick={() => readMessage()} disabled={account === ''}>Read</button>
          </section>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Resources</h3>
          <a href="https://docs.kadena.io/">Find in-depth information about Kadena. &rarr;</a>
          <a href="https://github.com/kadena-community/kadena.js/tree/master/packages/tools/create-kadena-app/pact">The smart contract powering this page. &rarr;</a>
        </div>
      </main>
    </div>
  )
}

export default Home
