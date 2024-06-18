'use client';

import { useState } from 'react';

const walletOrigin = () => (window as any).walletUrl || 'http://localhost:4173';
const walletUrl = () => `${walletOrigin()}/ready`;
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
async function getWalletConnection() {
  if (walletGlobal && !walletGlobal.closed) {
    return {
      message: communicate(window, walletGlobal),
      focus: () => walletGlobal?.focus(),
      close: () => walletGlobal?.close(),
    };
  }
  const wallet = window.open('', walletName);

  if (!wallet) {
    throw new Error('POPUP_BLOCKED');
  }
  const message = communicate(window, wallet);
  await Promise.race([
    message('GET_STATUS', {
      name: appName,
    }),
    new Promise((_, reject) => setTimeout(reject, 300)),
  ]).catch(async () => {
    wallet.location.href = walletUrl();
    // todo: replace this by a better way to know when the wallet is ready
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  });
  walletGlobal = wallet;
  return {
    message,
    focus: () => walletGlobal?.focus(),
    close: () => walletGlobal?.close(),
  };
}

export default function Home() {
  const [log, setLog] = useState<string[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const accentColor = profile?.accentColor ?? '#3b82f6';

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
              const { message } = await getWalletConnection();
              const response = await message('GET_STATUS', {
                name: appName,
              });
              console.log(response);
              log.push(JSON.stringify(response));
              setLog([...log]);
            }}
          >
            GET_STATUS
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Log</h2>
          <ul>
            {log.map((item, index) => (
              <li
                key={index}
                style={{
                  borderTop: '1px solid gray',
                  marginTop: '10px',
                  paddingTop: '10px',
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
