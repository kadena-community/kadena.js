import { setTransferCreateCommand } from '../pact/coin.js';
import {
  addCapability,
  buildCommand,
  listen,
  send,
  setData,
  setDomain,
  setMeta,
  setNetworkId,
  signWithKeypair,
} from '../pact/pact.js';
import type { IAnswers, IQuestion } from './questions.js';

const fundCondition = ({ task }: IAnswers): boolean => {
  if (Array.isArray(task))
    return task?.includes('fund') || task?.includes('setup');
  return false;
};

export const fundQuestions: IQuestion[] = [
  {
    message: 'What account would you like to fund?',
    name: 'account',
    type: 'input',
    when: fundCondition,
  },
  {
    message: 'On wich network would you like to fund the account?',
    name: 'network',
    type: 'input',
    defaultValue: 'development',
    when: fundCondition,
  },
  {
    message: 'On what chain would you like to fund the account?',
    name: 'chainId',
    type: 'input',
    choices: [...Array(20).keys()].map((i) => ({
      label: i.toString(),
      value: i.toString(),
    })),
    when: fundCondition,
  },
  {
    message: 'What endpoint would you like to use?',
    name: 'endpoint',
    type: 'input',
    defaultValue: 'http://localhost:8080',
    when: fundCondition,
  },
  {
    message: 'What public key would you like to use?',
    name: 'publicKey',
    type: 'input',
    when: fundCondition,
  },
  {
    message: 'Funding devnet accounts...',
    name: 'fundDevnet',
    type: 'execute',
    when: fundCondition,
    action: async ({
      account,
      chainId,
      network,
      endpoint,
      publicKey,
    }: IAnswers) => {
      if (
        typeof account !== 'string' ||
        typeof chainId !== 'string' ||
        typeof network !== 'string' ||
        typeof endpoint !== 'string' ||
        typeof publicKey !== 'string'
      )
        return { success: false };
      await buildCommand(
        setTransferCreateCommand('sender00', account, 'ks', 100),
        setMeta({
          gasLimit: 1000,
          gasPrice: 0.0000001,
          ttl: 60000,
          chainId: chainId,
          sender: 'sender00',
        }),
        setData({
          ks: {
            keys: [publicKey],
            pred: 'keys-all',
          },
        }),
        addCapability({
          name: 'coin.GAS',
          args: [],
          signer:
            '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
        }),
        addCapability({
          name: 'coin.TRANSFER',
          args: ['sender00', account, 100],
          signer:
            '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
        }),
        setNetworkId(network),
        setDomain(endpoint),
        signWithKeypair({
          publicKey:
            '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
          secretKey:
            '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
        }),
        send,
        listen,
      )({});
      return { success: true };
    },
  },
];
