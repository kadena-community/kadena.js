import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import {Answers, QuestionAnswer} from '../questions/questions.js';
import {useHistory} from '../hooks/use-history.js';

const Answer = ({value}: {value: string | string[] | Record<string, any>}) => {
	if (Array.isArray(value)) {
		return (
			<>
				{value.map((v, i) => (
					<Text color="green" key={v + i}>
						{JSON.stringify(v, null, 2)}
					</Text>
				))}
			</>
		);
	}
	return <Text color="green">{JSON.stringify(value, null, 2)}</Text>;
};

export const SummaryView = ({
	answeredQuestions,
}: {
	answeredQuestions: QuestionAnswer['answeredQuestions'];
}) => (
	<>
		{answeredQuestions.map(({question, answer}) => {
			const values = Object.values(answer);
			return (
				<Box
					key={question.name}
					flexDirection="column"
					marginX={2}
					marginTop={1}
				>
					<Text>{question.message}</Text>
					{values.map((value: any) => (
						<Answer key={JSON.stringify(value)} value={value} />
					))}
				</Box>
			);
		})}
	</>
);

export const Summary = ({
	answers,
	answeredQuestions,
}: {
	answers: Answers;
	answeredQuestions: QuestionAnswer['answeredQuestions'];
}) => {
	const {onSet} = useHistory('previous');
	useEffect(() => {
		onSet({
			answers,
			executions: answeredQuestions.filter(
				({question}) => question.type === 'execute',
			),
		});
	}, []);
	return <SummaryView answeredQuestions={answeredQuestions} />;
};
