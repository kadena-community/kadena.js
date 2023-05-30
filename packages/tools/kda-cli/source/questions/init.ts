import {localQuestions} from './local.js';
import {Answers, Question} from './questions.js';

export const questions: Question[] = [
	{
		message: 'What would you like to do?',
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
				label: 'Test a function of a smart contract',
				value: 'local',
			},
		],
	},
	{
		message: 'Rerunning previous commands...',
		type: 'rerun',
		name: 'rerun',
		when: ({task}: Answers) => !!task?.includes('rerun'),
	},
	...localQuestions,
];
