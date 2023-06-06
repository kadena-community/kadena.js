import { spawned } from '../utils/spawn.js';

import { IAnswers, IQuestion } from './questions.js';

import { readFileSync, writeFileSync } from 'fs';

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
    replaceValue('HOST_SERVICE_PORT', servicePort),
    replaceValue('HOST_STRATUM_PORT', stratumPort),
  );

const getEnvL1: StringReducer = composeEnv(8080, 1917);
const getEnvL2: StringReducer = composeEnv(8081, 1918);

const setupEnvFor = async (layer: 'l1' | 'l2'): Promise<void> => {
  const envFile = `~/devnet/${layer}/.env`;
  const env = readFileSync(envFile, 'utf-8');
  if (layer === 'l2') return writeFileSync(envFile, getEnvL2(env), 'utf-8');
  return writeFileSync(envFile, getEnvL1(env), 'utf-8');
};

export const devnetQuestions: IQuestion[] = [
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
    message: 'Cloning devnet: L1...',
    name: 'cloneDevnet',
    type: 'execute',
    when: ({ task }: IAnswers) => {
      if (Array.isArray(task)) return task?.includes('setup');
      return false;
    },
    action: async (answers: IAnswers) => {
      await spawned('mkdir -p ~/.devnet');
      await spawned(
        'git clone -b edmund/disable-pow-flag https://github.com/kadena-io/devnet.git ~/.devnet/l1',
      );
      return answers;
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
    action: async (answers: IAnswers) => {
      await spawned('mkdir -p ~/.devnet');
      await spawned(
        'git clone -b edmund/disable-pow-flag https://github.com/kadena-io/devnet.git ~/.devnet/l2',
      );
      return answers;
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
    action: async (answers: IAnswers) => {
      await setupEnvFor('l1');
      return answers;
    },
  },
];
