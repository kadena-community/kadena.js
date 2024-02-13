import { readFileSync } from 'fs';
import type { Reducer } from '../pact/pact.js';
import {
  addCapability,
  buildCommand,
  listen,
  send,
  setCommand,
  setData,
  setDomain,
  setMeta,
  setNetworkId,
  signWithChainweaver,
  signWithKeypair,
} from '../pact/pact.js';
import type { IAnswers, IQuestion } from './questions.js';

const isDeployTask = ({ task }: IAnswers): boolean => {
  if (Array.isArray(task)) return task.includes('deploy');
  return false;
};

const isL1 = ({ deployTargets }: IAnswers): boolean => {
  if (!Array.isArray(deployTargets)) return false;
  if (deployTargets?.includes('l1')) return true;
  if (deployTargets?.includes('l1l2')) return true;
  return false;
};

const isL2 = ({ deployTargets }: IAnswers): boolean => {
  if (!Array.isArray(deployTargets)) return false;
  if (deployTargets?.includes('l2')) return true;
  if (deployTargets?.includes('l1l2')) return true;
  return false;
};
const signAndSend = ({
  publicKey,
  secretKey,
  useChainWeaver,
}: {
  useChainWeaver: boolean;
  publicKey: string;
  secretKey: string;
}): Reducer => {
  if (useChainWeaver) return buildCommand(signWithChainweaver, send);
  return buildCommand(signWithKeypair({ publicKey, secretKey }), send);
};

const deploy = async ({
  chainIds,
  setDeploySettings,
  setDeployChainSettings,
}: {
  chainIds: string[];
  setDeployChainSettings: (chainId: string) => Reducer;
  setDeploySettings: Reducer;
}): Promise<unknown> => {
  try {
    for (const chainId of chainIds) {
      const res = await buildCommand(
        setDeployChainSettings(chainId),
        setDeploySettings,
      )({});
      console.log('res', res);
    }
    return { success: true };
  } catch (e) {
    console.log('e', e);
    return { success: false };
  }
};
const setDeployChainSettings =
  ({
    signer,
    network,
    endpoint,
  }: {
    signer: string;
    network: string;
    endpoint: string;
  }): ((chainId: string) => Reducer) =>
  (chainId: string) =>
    buildCommand(
      setMeta({
        gasLimit: 100000,
        gasPrice: 0.0000001,
        ttl: 60000,
        chainId: chainId,
        sender: signer,
      }),
      setNetworkId(network),
      setDomain(endpoint),
    );
const setDeploySettings = ({
  pactCode,
  data,
  publicKey,
  secretKey,
  useChainWeaver,
}: {
  pactCode: string;
  publicKey: string;
  secretKey: string;
  useChainWeaver: boolean;
  data: unknown;
}): Reducer =>
  buildCommand(
    setCommand(pactCode),
    addCapability({
      name: 'UNRESTRICTED',
      args: [],
      signer: publicKey,
    }),
    setData(data),
    signAndSend({ publicKey, secretKey, useChainWeaver }),
    listen,
  );

export const deployQuestions: IQuestion[] = [
  {
    message: 'What would you like to deploy? (Provide a `.pact` file)',
    name: 'pactFile',
    type: 'input',
    when: isDeployTask,
  },
  {
    message: 'What data goes with it? (Provide a `.json` file)',
    name: 'dataFile',
    type: 'input',
    when: isDeployTask,
  },
  {
    message: 'Where would you like to deploy?',
    name: 'deployTargets',
    type: 'multi-select',
    choices: [
      { label: 'L1', value: 'l1' },
      { label: 'L2', value: 'l2' },
      { label: 'L1 & L2', value: 'l1l2' },
    ],
    when: isDeployTask,
  },
  {
    message: 'On which chains on L1 would you like to deploy?',
    name: 'l1Chains',
    type: 'multi-select',
    choices: [...Array(20).keys()].map((i) => ({
      label: i.toString(),
      value: i.toString(),
    })),
    when: isL1,
  },
  {
    message: 'On which chains on L2 would you like to deploy?',
    name: 'l2Chains',
    type: 'multi-select',
    choices: [...Array(20).keys()].map((i) => ({
      label: i.toString(),
      value: i.toString(),
    })),
    when: isL2,
  },
  {
    message: 'Who is the signer?',
    name: 'signer',
    type: 'input',
    when: isDeployTask,
  },
  {
    message: 'Deploying...',
    name: 'deployment',
    type: 'execute',
    when: isDeployTask,
    action: async ({
      pactFile = '',
      dataFile = '',
      deployTargets = '',
      signer = '',
      l1Chains = [],
      l2Chains = [],
    }: IAnswers) => {
      if (typeof pactFile !== 'string' || pactFile === '')
        throw new Error('No pact file provided');
      if (typeof dataFile !== 'string' || dataFile === '')
        throw new Error('No data file provided');
      if (typeof signer !== 'string' || signer === '')
        throw new Error('No signer provided');
      if (deployTargets === '') throw new Error('No deploy targets provided');
      const pactCode = readFileSync(pactFile, 'utf8');
      const data = JSON.parse(readFileSync(dataFile, 'utf8'));

      const deployCommand = setDeploySettings({
        pactCode,
        data,
        publicKey:
          '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
        secretKey:
          '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
        useChainWeaver: false,
      });
      if (isL1({ deployTargets }) && Array.isArray(l1Chains)) {
        await deploy({
          chainIds: l1Chains,
          setDeployChainSettings: setDeployChainSettings({
            endpoint: 'http://localhost:8080',
            network: 'development',
            signer,
          }),
          setDeploySettings: deployCommand,
        });
      }
      if (isL2({ deployTargets }) && Array.isArray(l2Chains))
        await deploy({
          chainIds: l2Chains,
          setDeployChainSettings: setDeployChainSettings({
            endpoint: 'http://localhost:8081',
            network: 'development',
            signer,
          }),
          setDeploySettings: deployCommand,
        });
      return { success: true };
    },
  },
];
