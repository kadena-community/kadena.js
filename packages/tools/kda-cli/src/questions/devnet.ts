import { spawned } from '../utils/spawn.js';

import { IAnswers, IQuestion } from './questions.js';

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
      if (setupL2) return true;
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
];
