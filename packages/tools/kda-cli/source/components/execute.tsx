import {Answers, Question} from '../questions/questions.js';
import {Text} from 'ink';
import {Spinner} from '@inkjs/ui';
import React, {useEffect, useState} from 'react';

export const Execute = ({
	message,
	action,
	answers,
	onSubmit,
}: Question & {answers: Answers; onSubmit: (v: any) => void}) => {
	const [error, setError] = useState<string>();
	useEffect(() => {
		if (!action) {
			return setError('No action provided');
		}
		action(answers)
			.then((result: Answers) => {
				onSubmit(result);
			})
			.catch((error: Error) => {
				setError(error.message);
			});
	}, []);
	if (error) return <Text color="red">{error}</Text>;
	return <Spinner label={message} />;
};
