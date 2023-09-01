import { dotenv } from '../utils/env.js';
import { spawned } from '../utils/spawn.js';

import { type IAnswers, type IQuestion } from './questions.js';

import { readFileSync, writeFileSync } from 'fs';
import { parse, stringify } from 'yaml';

type StringReducer = (str: string) => string;

const compose =
  (...reducers: StringReducer[]): StringReducer =>
  (env: string) =>
    reducers.reduce((res, reducer) => reducer(res), env);

const replaceValue =
  (key: string, value: string | number): StringReducer =>
  (env: string) =>
    // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
    env.replace(new RegExp(`(${key}= ?).*`), `$1${value}`);

const composeEnv = (servicePort: number, stratumPort: number): StringReducer =>
  compose(
    replaceValue(
      'CHAINWEB_NODE_IMAGE',
      'ghcr.io/kadena-io/chainweb-node:sha-7e11817',
    ),
    replaceValue('HOST_SERVICE_PORT', servicePort),
    replaceValue('HOST_STRATUM_PORT', stratumPort),
  );

const getEnvL1: StringReducer = composeEnv(8080, 1917);
const getEnvL2: StringReducer = composeEnv(8081, 1918);

const setupEnvFor = async (layer: 'l1' | 'l2'): Promise<void> => {
  const envFile = `${dotenv.HOME}/.devnet/${layer}/.env`;
  const env = readFileSync(envFile, 'utf-8');
  if (layer === 'l2') return writeFileSync(envFile, getEnvL2(env), 'utf-8');
  return writeFileSync(envFile, getEnvL1(env), 'utf-8');
};

const getDockerFile = (env: 'l1' | 'l2'): string => {
  if (env === 'l2')
    return `${dotenv.HOME}/.devnet/${env}/docker-compose.minimal-l2.yaml`;
  return `${dotenv.HOME}/.devnet/${env}/docker-compose.minimal.yaml`;
};
const setupMacDockerCompose = (env: 'l1' | 'l2'): void => {
  const dcFile = readFileSync(getDockerFile(env), 'utf-8');
  const { services, ...dcJson } = parse(dcFile);

  const newServices = Object.entries(services).reduce((s, [key, value]) => {
    if (key === 'api-proxy')
      return {
        ...s,
        [key]: {
          ...(value as object),
          platform: 'linux/arm64/v8',
        },
      };
    return {
      ...s,
      [key]: {
        ...(value as object),
        platform: 'linux/amd64',
      },
    };
  }, services);

  writeFileSync(
    getDockerFile(env),
    stringify({ ...dcJson, services: newServices }),
    'utf-8',
  );
};

export const setupQuestions: IQuestion[] = [
  {
    message: 'Will you be developing for L2?',
    name: 'setupL2',
    type: 'confirm',
    when: ({ task }: IAnswers) => {
      if (Array.isArray(task)) return task?.includes('setup');
      return false;
    },
  },
  {
    message: 'Are you using a mac?',
    name: 'macOS',
    type: 'confirm',
    when: ({ task }: IAnswers) => {
      if (Array.isArray(task)) return task?.includes('setup');
      return false;
    },
  },
  {
    message: 'Are you using a mac with a M chip?',
    name: 'setupM1',
    type: 'confirm',
    when: ({ macOS }: IAnswers) => {
      return macOS === true;
    },
  },
  {
    message: 'Cloning devnet: L1...',
    name: 'cloneDevnet',
    type: 'execute',
    when: ({ task }: IAnswers) => {
      if (Array.isArray(task)) return task?.includes('setup');
      return false;
    },
    action: async () => {
      await spawned(`mkdir -p ${dotenv.HOME}/.devnet`);
      await spawned(
        `git clone -b edmund/disable-pow-flag https://github.com/kadena-io/devnet.git ${dotenv.HOME}/.devnet/l1`,
      );
      return { clone: 'success' };
    },
  },
  {
    message: 'Cloning devnet: L2...',
    name: 'cloneDevnetL2',
    type: 'execute',
    when: ({ setupL2 }: IAnswers) => {
      if (setupL2 === true) return true;
      return false;
    },
    action: async () => {
      await spawned(`mkdir -p ${dotenv.HOME}/.devnet`);
      await spawned(
        `git clone -b edmund/disable-pow-flag https://github.com/kadena-io/devnet.git ${dotenv.HOME}/.devnet/l2`,
      );
      return { clone: 'success' };
    },
  },
  {
    message: 'Prepare L1 devnet environment...',
    name: 'prepareDevnet',
    type: 'execute',
    when: ({ task }: IAnswers) => {
      if (Array.isArray(task)) return task?.includes('setup');
      return false;
    },
    action: async ({ setupM1 }) => {
      await setupEnvFor('l1');
      if (setupM1 === true) setupMacDockerCompose('l1');
      return { prepare: 'success' };
    },
  },
  {
    message: 'Prepare L2 devnet environment...',
    name: 'prepareDevnetL2',
    type: 'execute',
    when: ({ setupL2 }: IAnswers) => {
      if (setupL2 === true) return true;
      return false;
    },
    action: async ({ setupM1 }) => {
      await setupEnvFor('l2');
      if (setupM1 === true) setupMacDockerCompose('l2');
      return { prepare: 'success' };
    },
  },
];

export const startQuestions: IQuestion[] = [
  {
    message: 'Starting L1 devnet...',
    name: 'startDevnet',
    type: 'execute',
    when: ({ task }: IAnswers) => {
      if (Array.isArray(task))
        return task?.includes('start') || task?.includes('setup');
      return false;
    },
    action: async () => {
      await spawned(
        `cd ${dotenv.HOME}/.devnet/l1 && docker compose -f docker-compose.minimal.yaml up --remove-orphans -d`,
        true,
      );
      return { start: 'success' };
    },
  },
  {
    message: 'Starting L2 devnet...',
    name: 'startDevnetL2',
    type: 'execute',
    when: ({ task }: IAnswers) => {
      if (Array.isArray(task))
        return task?.includes('start') || task?.includes('setup');
      return false;
    },
    action: async () => {
      const exitCode = await spawned(`ls ${dotenv.HOME}/.devnet/l2`);
      if (exitCode !== 0) return { start: 'skipped' };
      await spawned(
        `cd ${dotenv.HOME}/.devnet/l2 && docker compose -f docker-compose.minimal-l2.yaml up --remove-orphans -d`,
        true,
      );
      return { start: 'success' };
    },
  },
];

const stopQuestions: IQuestion[] = [
  {
    message: 'Stopping L1 devnet...',
    name: 'stopDevnet',
    type: 'execute',
    when: ({ task }: IAnswers): boolean => {
      if (Array.isArray(task)) return task?.includes('stop');
      return false;
    },
    action: async (): Promise<IAnswers> => {
      await spawned(
        `cd ${dotenv.HOME}/.devnet/l1 && docker compose -f docker-compose.minimal.yaml down`,
        true,
      );
      return { stop: 'success' };
    },
  },
  {
    message: 'Stopping L2 devnet...',
    name: 'stopDevnetL2',
    type: 'execute',
    when: ({ task }: IAnswers): boolean => {
      if (!Array.isArray(task)) return false;
      if (!task?.includes('stop')) return false;
      return true;
    },
    action: async (): Promise<IAnswers> => {
      const exitCode = await spawned(`ls ${dotenv.HOME}/.devnet/l2`);
      if (exitCode !== 0) return { stop: 'skipped' };
      await spawned(
        `cd ${dotenv.HOME}/.devnet/l2 && docker compose -f docker-compose.minimal-l2.yaml down`,
        true,
      );
      return { stop: 'success' };
    },
  },
];

export const devnetQuestions: IQuestion[] = [
  ...setupQuestions,
  ...startQuestions,
  ...stopQuestions,
];
