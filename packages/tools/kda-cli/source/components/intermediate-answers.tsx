import {Box, Text} from 'ink';
import React from 'react';

export const IntermediateAnswers = ({answers}: {answers: string[]}) => {
	return (
		<Box flexDirection="column">
			{answers.map((answer, index) => (
				<Text key={answer + index}>{answer}</Text>
			))}
		</Box>
	);
};
