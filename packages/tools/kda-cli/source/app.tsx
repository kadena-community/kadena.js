import React, {useCallback, useState} from 'react';
import {questions} from './questions/init.js';
import {onAnswer, QuestionWrapper} from './components/question.js';
import {
	Answers,
	getNextQuestion,
	QuestionAnswer,
} from './questions/questions.js';
import {Summary} from './components/summary.js';

type Props = {
	task?: string;
};
export default function App({task}: Props) {
	const [qna, setQNA] = useState<QuestionAnswer>({
		current: questions[0],
		answers: {},
		questions,
		answeredQuestions: [],
	});
	const onAnswer = useCallback<onAnswer>(
		(answer: Answers) => {
			if (!qna.current) throw new Error('No current question');
			const mergedAnswers = {...qna.answers, ...answer};
			const nextQNA = getNextQuestion({
				...qna,
				answers: mergedAnswers,
				answeredQuestions: [
					...qna.answeredQuestions,
					{question: qna.current, answer},
				],
			});
			setQNA(nextQNA);
			return mergedAnswers;
		},
		[qna, setQNA],
	);
	if (!qna.current || task)
		return (
			<Summary
				answers={qna.answers}
				answeredQuestions={qna.answeredQuestions}
			/>
		);
	return (
		<QuestionWrapper
			{...qna.current}
			onAnswer={onAnswer}
			answers={qna.answers}
		/>
	);
}
