'use client';

import { useState } from 'react';

const walletUrl = 'http://localhost:1420';
const walletOrigin = 'http://localhost:1420';
const walletName = 'Dev-Wallet';
const appName = 'Dev Wallet Example';

const communicate =
  (client: Window, server: Window) =>
  (type: string, payload: Record<string, unknown>) => {
    const id = crypto.randomUUID();
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data && event.data.id === id) {
          client.removeEventListener('message', handler);
          resolve(event.data);
        }
      };
      client.addEventListener('message', handler);
      server.postMessage({ payload, id, type }, walletOrigin);
    });
  };

async function launchDevWallet() {
  return new Promise<Window>(async (resolve, reject) => {
    // const listener = (event: MessageEvent) => {
    //   console.log('Received message', event.data);
    //   if (event.origin === walletOrigin) {
    //     console.log('Received message', event.data);
    //     if (event.data.type === 'DEV_WALLET_READY') {
    //       window.removeEventListener('message', listener);
    //       resolve(event.data);
    //     }
    //   }
    // };
    // window.addEventListener('message', listener);
    const wallet = window.open(walletUrl, walletName);
    if (!wallet) {
      throw new Error('POPUP_BLOCKED');
    }
    resolve(wallet);
  });
}

export default function Home() {
  const [wallet, setWallet] = useState<Window | null>(null);
  const [log, setLog] = useState<string[]>([]);
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
            className="mt-8 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={async () => {
              const wallet = await launchDevWallet();
              setWallet(wallet);
            }}
          >
            Open Dev Wallet
          </button>
          <button
            disabled={!wallet}
            onClick={async () => {
              if (!wallet) return;
              const message = communicate(window, wallet);
              const response = await message('CONNECTION_REQUEST', {
                name: appName,
              });
              console.log(response);
              log.push(JSON.stringify(response));
              setLog([...log]);
            }}
          >
            send message
          </button>

          <button
            disabled={!wallet}
            onClick={async () => {
              if (!wallet) return;
              const message = communicate(window, wallet);
              const response = await message('IS_UNLOCKED', {
                name: appName,
              });
              console.log(response);
              log.push(JSON.stringify(response));
              setLog([...log]);
            }}
          >
            IS_UNLOCKED
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Log</h2>
          <ul>
            {log.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
