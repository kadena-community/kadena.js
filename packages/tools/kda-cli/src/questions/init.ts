import { deployQuestions } from './deploy.js';
import { devnetQuestions } from './devnet.js';
import { fundQuestions } from './fund.js';
import { localQuestions } from './local.js';
import type { IAnswers, IQuestion } from './questions.js';

export const questions: IQuestion[] = [
  {
    message: 'What would you like to do? (use spacebar to select an option)',
    name: 'task',
    type: 'multi-select',
    defaultValue: ['rerun'],
    choices: [
      {
        label: 'Rerun',
        value: 'rerun',
      },
      {
        label: 'Setup devnet',
        value: 'setup',
      },
      {
        label: 'Start devnet',
        value: 'start',
      },
      {
        label: 'Stop devnet',
        value: 'stop',
      },
      {
        label: 'Fund devnet accounts',
        value: 'fund',
      },
      {
        label: 'Deploy a smart contract',
        value: 'deploy',
      },
      {
        label: 'Test a function of a smart contract',
        value: 'local',
      },
    ],
    when: ({ task }: IAnswers) => {
      if (Array.isArray(task)) return task.length === 0;
      return false;
    },
  },
  {
    message: 'Rerunning previous commands...',
    type: 'rerun',
    name: 'rerun',
    when: ({ task }: IAnswers) => {
      if (Array.isArray(task)) return task?.includes('rerun');
      return false;
    },
  },
  ...localQuestions,
  ...devnetQuestions,
  ...fundQuestions,
  ...deployQuestions,
];
