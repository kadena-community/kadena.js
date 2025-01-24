'use client';

import {
  ChainId,
  createTransaction,
  ICommand,
  IPartialPactCommand,
} from '@kadena/client';
import { transferAllCommand } from '@kadena/client-utils/coin';
import { hash } from 'crypto';
import { useState } from 'react';

const sleep = (time: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });

const walletOrigin = () => (window as any).walletUrl || 'http://localhost:4173';
const walletUrl = () => `${walletOrigin()}`;
const walletName = 'Dev-Wallet';
const appName = 'Dev Wallet Example';

type ResponseType = {
  id: string;
  type: string;
  payload: unknown;
  error: unknown;
};

const communicate =
  (client: Window, server: Window) =>
  (type: string, payload: Record<string, unknown>): Promise<ResponseType> => {
    const id = crypto.randomUUID();
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data && event.data.id === id) {
          client.removeEventListener('message', handler);
          resolve(event.data);
          server.blur();
          window.focus();
        }
      };
      client.addEventListener('message', handler);
      server.postMessage({ payload, id, type }, walletOrigin());
    });
  };

let walletGlobal: Window | null = null;
async function getWalletConnection(page: string = '', popup = true) {
  if (walletGlobal && !walletGlobal.closed) {
    return {
      message: communicate(window, walletGlobal),
      focus: () => walletGlobal?.focus(),
      close: () => walletGlobal?.close(),
    };
  }
  const wallet = window.open(
    '',
    walletName,
    popup ? 'width=800,height=800' : undefined,
  );

  if (!wallet) {
    throw new Error('POPUP_BLOCKED');
  }
  const message = communicate(window, wallet);
  const waitForWallet = async () => {
    for (let i = 0; i < 50; i++) {
      try {
        await Promise.race([
          message('GET_STATUS', {
            name: appName,
          }),
          sleep(300).then(() => {
            throw new Error('TIMEOUT');
          }),
        ]);
      } catch (e) {
        console.log('error', e);
        continue;
      }
      console.log('wallet is ready');
      break;
    }
  };
  await Promise.race([
    message('GET_STATUS', {
      name: appName,
    }),
    sleep(300).then(() => {
      throw new Error('TIMEOUT');
    }),
  ]).catch(async () => {
    wallet.location.href = walletUrl();
    // todo: replace this by a better way to know when the wallet is ready
    return waitForWallet();
  });
  walletGlobal = wallet;
  return {
    message,
    focus: () => walletGlobal?.focus(),
    close: () => walletGlobal?.close(),
  };
}

interface IState {
  profile: {
    name: string;
    accentColor: string;
    uuid: string;
  };
  accounts: Array<{
    address: string;
    guard: { keys: string[]; pred: 'keys-all' | 'keys-any' | 'keys-2' };
    alias: string;
    contract: string;
    chains: Array<{ chainId: ChainId; balance: string }>;
    overallBalance: string;
  }>;
}

export default function Home() {
  const [log, setLog] = useState<string[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [state, setState] = useState<IState>();
  const [signedTx, setSignedTx] = useState<ICommand>();
  const accentColor = profile?.accentColor ?? '#3b82f6';
  const signDisabled = !state || (state && state.accounts.length < 2);

  const addLog = (data: unknown) => {
    log.push(JSON.stringify(data));
    setLog([...log]);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex flex-col">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-4xl font-bold text-center">
            Welcome to the Dev Wallet Example
          </h1>
          <p className="text-center">
            This is a simple example of a dApp that uses the Dev Wallet to sign
            transactions.
          </p>

          <button
            className="mt-8 px-4 py-2 text-white rounded"
            style={{ backgroundColor: accentColor }}
            onClick={async () => {
              const { message, focus, close } = await getWalletConnection();
              focus();
              const response = await message('CONNECTION_REQUEST', {
                name: appName,
              });
              addLog(response);
              if ((response.payload as any).status !== 'accepted') {
                return;
              }
              const status = await message('GET_STATUS', {
                name: appName,
              });
              addLog(status);
              setProfile((status.payload as any).profile);
              close();
            }}
          >
            {profile
              ? `Connected to ${profile.name} profile`
              : 'Connect to Dev Wallet'}
          </button>

          <button
            className={
              'mt-8 px-4 py-2 rounded ' +
              (profile
                ? 'bg-gray-500 text-white '
                : 'cursor-not-allowed bg-gray-300 text-gray-50')
            }
            disabled={!profile}
            onClick={async () => {
              const { message, close } = await getWalletConnection();
              const response = await message('GET_STATUS', {
                name: appName,
              });
              addLog(response);
              setState(response.payload as IState);
              console.log(response.payload);
              close();
            }}
          >
            GET_STATUS
          </button>
        </div>
        <div>
          {state && (
            <>
              <h2>Wallet Data</h2>
              <div>name: {state.profile.name}</div>
              <h3>Accounts</h3>
              {
                <ul>
                  {state.accounts.map((account, index) => (
                    <li key={index}>
                      <div>Address: {account.address}</div>
                      <div>Alias: {account.alias}</div>
                      <div>Contract: {account.contract}</div>
                      <div>overallBalance: {account.overallBalance}</div>
                      <div>Guard: {JSON.stringify(account.guard)}</div>
                    </li>
                  ))}
                </ul>
              }
            </>
          )}
        </div>
        <button
          className={`mt-8 px-4 py-2 text-white rounded ${signDisabled ? 'bg-gray-300 text-gray-50' : 'bg-blue-500'}`}
          disabled={!state || (state && state.accounts.length < 2)}
          onClick={async () => {
            if (!state) return;
            const { message, focus, close } = await getWalletConnection();
            const accounts = state.accounts.filter(
              ({ overallBalance }) => +overallBalance > 0,
            );
            if (accounts.length < 2) {
              setLog(['Not enough accounts with balance']);
            }
            const tx = transferAllCommand({
              sender: {
                account: accounts[0].address,
                publicKeys: accounts[0].guard.keys,
              },
              receiver: {
                account: accounts[1].address,
                keyset: accounts[1].guard,
              },
              chainId: accounts[0].chains[0].chainId,
              amount: accounts[0].chains[0].balance,
              contract: accounts[0].contract,
            });
            focus();
            const response = await message(
              'SIGN_REQUEST',
              createTransaction(tx()) as any,
            );
            console.log(response);
            const payload: {
              status: 'signed' | 'rejected';
              transaction?: ICommand;
            } = response.payload as any;
            if (payload && payload.status === 'signed') {
              setSignedTx(payload.transaction as ICommand);
            }
            addLog(response);
            close();
          }}
        >
          Transfer balance from account 1 to account 2
        </button>

        <div
          style={{
            width: '80vw',
            padding: 10,
            overflow: 'auto',
          }}
        >
          {signedTx && (
            <>
              <h2>Signed Transaction</h2>
              <pre
                className="bg-gray-50 overflow-auto"
                style={{
                  width: '100%',
                }}
              >
                {JSON.stringify(
                  {
                    cmd: JSON.parse(signedTx.cmd),
                    hash: signedTx.hash,
                    sigs: signedTx.sigs,
                  },
                  undefined,
                  2,
                )}
              </pre>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
