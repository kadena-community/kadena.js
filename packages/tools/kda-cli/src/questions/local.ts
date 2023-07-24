import {
  ChainId,
  createTransaction,
  getClient,
  ICap,
  isSignedCommand,
  signWithChainweaver,
} from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { PactValue } from '@kadena/types';

import { isTruthy } from '../utils/bool.js';

import { IAnswers, IQuestion } from './questions.js';

type ValidSigningAnswers = IAnswers & {
  command: string;
  capabilities: string[];
  signer: string;
  publicKey: string;
  chainId: string;
  network: string;
  endpoint: string;
};
const isValidSigningAnswers = (
  answers: IAnswers,
): answers is ValidSigningAnswers => {
  if (typeof answers.command !== 'string') throw new Error('Invalid command');
  if (!Array.isArray(answers.capabilities))
    throw new Error('Invalid capabilities');
  if (typeof answers.signer !== 'string') throw new Error('Invalid signer');
  if (typeof answers.publicKey !== 'string')
    throw new Error('Invalid publicKey');
  if (typeof answers.chainId !== 'string') throw new Error('Invalid chainId');
  if (typeof answers.network !== 'string') throw new Error('Invalid network');
  if (typeof answers.endpoint !== 'string') throw new Error('Invalid endpoint');
  return true;
};
const mapCapValue = (
  value?: string,
  // eslint-disable-next-line @rushstack/no-new-null
): null | string | number | { int: number } => {
  if (value === undefined) return null;
  if (value.startsWith('"') && value.endsWith('"'))
    return value.replace(/^"|"$/g, '');
  if (value.includes('.')) return parseFloat(value);
  return { int: parseInt(value, 10) };
};
export const mapCapability = (cap: string): ICap => {
  const [name, ...args] = cap.split(' ');
  if (!name) throw new Error('Invalid capability');
  const [lastArg, ...rargs] = args.reverse();
  return {
    name: name.replace(/^\(/, ''),
    args: [...rargs.reverse(), lastArg?.replace(/\)$/, '')]
      .map(mapCapValue)
      .filter((x) => x !== null) as PactValue[],
  };
};
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
type all = any;
export const asyncPipe =
  (...args: Array<(arg: all) => all>): ((init: all) => Promise<all>) =>
  (init: all): Promise<all> =>
    args.reduce((chain, fn) => chain.then(fn), Promise.resolve(init));

const apiHostGenerator =
  (
    endpoint?: string,
  ): (({
    networkId,
    chainId,
  }: {
    networkId: string;
    chainId: ChainId;
  }) => string) =>
  ({ networkId, chainId }) => {
    switch (networkId) {
      case 'mainnet01':
        return `${
          endpoint ?? 'https://api.chainweb.com'
        }/chainweb/0.0/${networkId}/chain/${chainId ?? '1'}/pact`;
      case 'testnet04':
        return `${
          endpoint ?? 'https://api.testnet.chainweb.com'
        }/chainweb/0.0/testnet04/chain/${chainId ?? '1'}/pact`;
      case 'fast-development':
      default:
        return `${
          endpoint ?? 'http://localhost:8080'
        }/chainweb/0.0/fast-development/chain/${chainId ?? '1'}/pact`;
    }
  };

export const localQuestions: IQuestion[] = [
  {
    message: 'On which network are you testing?',
    name: 'network',
    type: 'input',
    when: ({ task }: IAnswers) => {
      if (Array.isArray(task)) return isTruthy(task?.includes('local'));
      return false;
    },
  },
  {
    message: 'What is the endpoint',
    name: 'endpoint',
    type: 'input',
    when: ({ network, task }: IAnswers) => {
      if (Array.isArray(task)) return isTruthy(task?.includes('local'));
      return isTruthy(network);
    },
  },
  {
    message: 'What is the command you want to test?',
    name: 'command',
    type: 'input',
    when: ({ network, task }: IAnswers) => {
      if (Array.isArray(task)) return isTruthy(task?.includes('local'));
      return isTruthy(network);
    },
  },
  {
    message: 'On what chain do you want to execute the command?',
    name: 'chainId',
    type: 'input',
    when: ({ network, task }: IAnswers) => {
      if (Array.isArray(task)) return isTruthy(task?.includes('local'));
      return isTruthy(network);
    },
  },
  {
    message: 'What capabilities do you need?',
    name: 'capabilities',
    type: 'multi-input',
    when: ({ command, task }: IAnswers) => {
      if (Array.isArray(task)) return isTruthy(task?.includes('local'));
      return isTruthy(command);
    },
  },
  {
    message: 'Who is signing the transaction?',
    name: 'signer',
    type: 'input',
    when: ({ command, task }: IAnswers) => {
      if (Array.isArray(task)) return isTruthy(task?.includes('local'));
      return isTruthy(command);
    },
  },
  {
    message: 'What is the public key of the signer?',
    name: 'publicKey',
    type: 'input',
    when: ({ signer, task }: IAnswers) => {
      if (Array.isArray(task)) return isTruthy(task?.includes('local'));
      return isTruthy(signer);
    },
  },
  {
    message: 'Signing command...',
    name: 'signCommand',
    type: 'execute',
    when: ({ signer, task }: IAnswers) => {
      if (Array.isArray(task)) return isTruthy(task?.includes('local'));
      return isTruthy(signer);
    },
    action: async (answers: IAnswers) => {
      if (!isValidSigningAnswers(answers)) throw new Error('Invalid answers');

      const {
        network,
        command,
        capabilities,
        signer,
        publicKey,
        chainId,
        endpoint,
      } = answers;
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });

      if (typeof command !== 'string') throw new Error('Invalid command');

      const { preflight } = getClient(apiHostGenerator(endpoint));
      const res = await asyncPipe(
        composePactCommand(
          execution(command),
          setMeta({
            gasLimit: 1000,
            gasPrice: 0.0000001,
            ttl: 60000,
            chainId: chainId as ChainId,
            sender: signer,
          }),
          setNetworkId(network),
          addSigner(publicKey, (withCapability) => [
            withCapability('coin.GAS'),
            ...capabilities.map(mapCapability),
          ]),
        ),
        createTransaction,
        (tx) => {
          console.log(JSON.stringify(tx, null, 2));
          return tx;
        },
        signWithChainweaver,
        (tr) => (isSignedCommand(tr) ? tr : Promise.reject('TR_NOT_SIGNED')),
        // do preflight first to check if everything is ok without paying gas
        (tr) => preflight(tr).then((res) => [tr, res]),
        ([tr, res]) =>
          res.result.status === 'success' ? tr : Promise.reject(res),
        // submit the tr if the preflight is ok
      )({});

      return res;
    },
  },
  {
    message: 'Executing command...',
    name: 'executeCommand',
    type: 'execute',
    when: ({ signCommand, task }: IAnswers) => {
      if (Array.isArray(task)) return isTruthy(task?.includes('local'));
      return isTruthy(signCommand);
    },
    action: async (answers: IAnswers) => {
      const { signCommand, endpoint } = answers;

      if (typeof endpoint !== 'string') throw new Error('Invalid endpoint');
      if (!isTruthy(signCommand)) throw new Error('Invalid signCommand');

      const { submit, pollStatus } = getClient(apiHostGenerator(endpoint));
      const res = await asyncPipe(submit, pollStatus)(signCommand);

      return { result: res?.result, response: res?.response };
    },
  },
];
