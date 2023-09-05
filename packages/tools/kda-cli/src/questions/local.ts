import type { SignedPayload } from '../pact/pact.js';
import {
  addCapabilities,
  addCapability,
  buildCommand,
  local,
  setCommand,
  setDomain,
  setMeta,
  setNetworkId,
  signWithChainweaver,
} from '../pact/pact.js';
import { isTruthy } from '../utils/bool.js';

import type { IAnswers, IQuestion } from './questions.js';

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
const isSignCommand = (
  signCommand: unknown,
): signCommand is Partial<SignedPayload> => {
  if (typeof signCommand !== 'object') return false;
  return true;
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
    when: ({ network }: IAnswers) => isTruthy(network),
  },
  {
    message: 'What is the command you want to test?',
    name: 'command',
    type: 'input',
    when: ({ network }: IAnswers) => isTruthy(network),
  },
  {
    message: 'On what chain do you want to execute the command?',
    name: 'chainId',
    type: 'input',
    when: ({ network }: IAnswers) => isTruthy(network),
  },
  {
    message: 'What capabilities do you need?',
    name: 'capabilities',
    type: 'multi-input',
    when: ({ command }: IAnswers) => isTruthy(command),
  },
  {
    message: 'Who is signing the transaction?',
    name: 'signer',
    type: 'input',
    when: ({ command }: IAnswers) => isTruthy(command),
  },
  {
    message: 'What is the public key of the signer?',
    name: 'publicKey',
    type: 'input',
    when: ({ signer }: IAnswers) => isTruthy(signer),
  },
  {
    message: 'Signing command...',
    name: 'signCommand',
    type: 'execute',
    when: ({ signer }: IAnswers) => isTruthy(signer),
    action: async (answers: IAnswers) => {
      if (!isValidSigningAnswers(answers)) throw new Error('Invalid answers');

      const {
        network,
        endpoint,
        command,
        capabilities,
        signer,
        publicKey,
        chainId,
      } = answers;
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });

      const res = await buildCommand(
        setCommand(command),
        setMeta({
          gasLimit: 1000,
          gasPrice: 0.0000001,
          ttl: 60000,
          chainId: chainId,
          sender: signer,
        }),
        addCapability({
          name: 'coin.GAS',
          args: [],
          signer: publicKey,
        }),
        addCapabilities(capabilities, publicKey),
        setNetworkId(network),
        setDomain(endpoint),
        signWithChainweaver,
      )({});

      return res;
    },
  },
  {
    message: 'Executing command...',
    name: 'executeCommand',
    type: 'execute',
    when: ({ signCommand }: IAnswers) => isTruthy(signCommand),
    action: async (answers: IAnswers) => {
      const { signCommand } = answers;

      if (!isSignCommand(signCommand)) throw new Error('Invalid signCommand');

      const res = await buildCommand(
        local({ signatureValidation: false, preflight: false }),
      )(signCommand);
      return { result: res?.result, response: res?.response };
    },
  },
];
