import React, {useCallback, useState} from 'react';
import {useHistory} from '../hooks/use-history.js';
import {questions} from '../questions/init.js';
import {Question} from '../questions/questions.js';
import {QuestionWrapper} from './question.js';
import {SummaryView} from './summary.js';

const getExecutionAction = ({name}: Question) =>
	questions.find(question => question.name === name)?.action;
export const Rerun = () => {
	const {history} = useHistory('previous') as any;
	const [answers, setAnswers] = useState(history.answers);
	const [currentExecution, setCurrentExecution] = useState(
		history.executions[0],
	);
	setCurrentExecution;

	const onAnswer = useCallback(
		(answer: any) => {
			setAnswers({
				...answers,
				[currentExecution.question.name]: answer,
			});
			const executionIndex = history.executions.findIndex(
				(execution: any) =>
					execution.question.name === currentExecution.question.name,
			);
			const nextExecution = history.executions[executionIndex + 1];
			setCurrentExecution(nextExecution);
		},
		[currentExecution?.question?.name, answers],
	);

	if (!currentExecution) {
		return (
			<SummaryView
				answeredQuestions={history.executions.map(({question}: any) => ({
					question,
					answer: answers[question.name],
				}))}
			/>
		);
	}

	return (
		<QuestionWrapper
			{...currentExecution.question}
			action={getExecutionAction(currentExecution.question)}
			answers={history.answers}
			onAnswer={onAnswer}
		/>
	);
};
