import { useState } from 'react';
import {
  getPublicKey,
  getVersion,
  openApp,
  signTransaction,
} from '../../src/index';

function App() {
  const [openAppResult, setOpenAppResult] = useState('');
  const [getPublicKeyResult, setGetPublicKeyResult] = useState('');
  const [getVersionResult, setGetVersionResult] = useState<any>('');
  const [signTransactionResult, setSignTransactionResult] = useState<any>('');

  return (
    <div className="flex flex-col items-center justify-center pt-8">
      <h1 className="text-3xl font-bold">Kadena ledger example</h1>
      <div className="flex flex-col gap-4 p-8 justify-between">
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => openApp().then(() => setOpenAppResult('success'))}
          >
            Open App
          </button>
          <div className="break-all min-h-8">{openAppResult}</div>
        </div>

        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              getPublicKey(0).then((x) => setGetPublicKeyResult(x))
            }
          >
            Get public key
          </button>
          <div className="break-all min-h-8">
            {JSON.stringify(getPublicKeyResult)}
          </div>
        </div>

        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => getVersion().then((x) => setGetVersionResult(x))}
          >
            Get version
          </button>
          <div className="break-all min-h-8">
            {JSON.stringify(getVersionResult)}
          </div>
        </div>

        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              signTransaction(0, 'transfer', {
                recipient:
                  '2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
                recipientChainId: '0',
                networkId: 'testnet04',
                amount: 0.1,
                namespace_: '',
                module_: '',
                gasPrice: '1.0e-6',
                gasLimit: '2300',
                creationTime: '1723017869',
                chainId: '0',
                nonce: '',
                ttl: '600',
                type: 'transfer',
              }).then((x) => setSignTransactionResult(x))
            }
          >
            Sign transaction
          </button>
          <div className="break-all min-h-8">
            {JSON.stringify(signTransactionResult)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
