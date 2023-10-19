import {
  ChainId,
  createClient,
  createTransaction,
  ICommand,
  IUnsignedCommand,
} from '@kadena/client';
import { composePactCommand, setMeta, setNetworkId } from '@kadena/client/fp';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { createTransferTransaction } from './account';
import { signWithKeyPair, signWithSeed } from './sign';

export type Layer = 'l1' | 'l2';
const getPort = (layer: Layer) => {
  if (layer === 'l2') return Number(import.meta.env.VITE_LAYER_2_PORT ?? 8081);
  return Number(import.meta.env.VITE_LAYER_1_PORT ?? 8080);
};

export const getClient = (layer: Layer) =>
  createClient(
    ({ chainId, networkId }) =>
      `http://localhost:${getPort(
        layer,
      )}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  );

export const inspect =
  (tag: string): (<T>(data: T) => T) =>
  <T>(data: T): T => {
    console.log(tag, data);
    return data;
  };

export const asyncPipe =
  (...args: Array<(arg: any) => any>): ((init: any) => Promise<any>) =>
  (init: any): Promise<any> =>
    args.reduce((chain, fn) => chain.then(fn), Promise.resolve(init));

export const local = (layer: Layer) => (tx: IUnsignedCommand) =>
  getClient(layer).local(tx, {
    preflight: false,
    signatureVerification: false,
  });

export const submit = (layer: Layer) => (tx: ICommand) =>
  getClient(layer).submit(tx);

export const getInfo = ({
  networkId,
  layer,
  chainId,
}: {
  networkId: string;
  layer: Layer;
  chainId: ChainId;
}) =>
  asyncPipe(
    composePactCommand(
      setMeta({
        chainId,
        gasLimit: 1000,
        gasPrice: 0.00000001,
      }),
      setNetworkId(networkId),
    ),
    createTransaction,
    local(layer),
  );

export const send = ({
  networkId,
  layer,
  chainId,
  senderAccount,
  seed,
  index,
}: {
  seed: Uint8Array;
  index: number;
  senderAccount: string;
  networkId: string;
  layer: Layer;
  chainId: ChainId;
}) =>
  asyncPipe(
    composePactCommand(
      setMeta({
        chainId,
        gasLimit: 1000,
        gasPrice: 0.00000001,
        senderAccount: senderAccount,
      }),
      setNetworkId(networkId),
    ),
    createTransaction,
    signWithSeed(seed, index),
    submit(layer),
  );

// Used for quick testing of a transaction
// Can be used to test a key pair or connection to devnet
export const localTestTransaction = async (
  publicKey: string,
  privateKey: string,
  receiver: string,
) => {
  const cmd = createTransferTransaction({
    sender: `k:${publicKey}`,
    senderKey: publicKey,
    receiver: receiver,
    amount: 0.1,
    chainId: '0',
  });
  const signed = signWithKeyPair(publicKey, privateKey)(cmd);
  return getClient('l1')
    .local(signed as any, {
      preflight: false,
      signatureVerification: true,
    })
    .then((res) => {
      console.log('local result:', res);
      return true;
    })
    .catch((err) => {
      console.log('local error:', err);
      return false;
    });
};

export const safeJsonParse = <T>(str?: string | null): T | null => {
  try {
    if (!str) return null;
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

/**
 * Make a memoized version function that caches the result of the inputs and returns the cached result if the inputs are the same
 * @param cb : function to memoize
 * @param getKey : optional function to generate a key from the input
 */
export const withMemory = <T extends (input: string) => unknown>(
  cb: T,
  getKey = (a: string) => a,
): T => {
  const memory = new Map<string, ReturnType<T>>();
  const memoizedFunction: T = ((input: string) => {
    const key = getKey(input);
    if (!memory.has(key)) {
      memory.set(key, cb(input) as ReturnType<T>);
    }
    return memory.get(key) as ReturnType<T>;
  }) as T;
  return memoizedFunction;
};

export const generateWords = () => {
  return generateMnemonic(wordlist);
};
