import {MultiSelect, Select, TextInput} from '@inkjs/ui';
import {Box, Text} from 'ink';
import React from 'react';
import {Execute} from './execute.js';
import {MultiInput} from './multi-input.js';
import {Answers, Question} from '../questions/questions.js';
import {useHistory} from '../hooks/use-history.js';
import {Rerun} from './rerun.js';

export type onAnswer = (answer: Answers) => Answers;

const getComponent: any = (type: string) => {
	switch (type) {
		case 'multi-select':
			return MultiSelect;
		case 'select':
			return Select;
		case 'multi-input':
			return MultiInput;
		case 'execute':
			return Execute;
		case 'rerun':
			return Rerun;
		case 'input':
		default:
			return TextInput;
	}
};

const getDefaultValue = (
	history: unknown,
	defaultValue: string | string[] | undefined,
) => {
	if (!Array.isArray(history)) return defaultValue;
	return history[0] || defaultValue;
};
export const QuestionWrapper = ({
	message,
	name,
	type,
	choices,
	onAnswer,
	defaultValue,
	answers,
	action,
}: Question & {onAnswer: onAnswer; answers: Answers}) => {
	const Component = getComponent(type);
	const {history, onSave} = useHistory(name);

	return (
		<Box marginX={2} marginY={1} flexDirection="column">
			<Text>{message}</Text>
			<Component
				key={name}
				name={name}
				placeholder={getDefaultValue(history, defaultValue)}
				options={choices}
				suggestions={history}
				action={action}
				onSubmit={(value: string | string[]) => {
					onSave(value);
					onAnswer({[name]: value});
				}}
				answers={answers}
			/>
		</Box>
	);
};
