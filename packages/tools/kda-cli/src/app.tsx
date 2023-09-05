import type { OnAnswer } from './components/question.js';
import { QuestionWrapper } from './components/question.js';
import { Summary } from './components/summary.js';
import { useHistory } from './hooks/use-history.js';
import { questions } from './questions/init.js';
import type { IAnswers, IQuestionAnswer } from './questions/questions.js';
import { getNextQuestion } from './questions/questions.js';

import React, { useCallback, useEffect, useState } from 'react';

interface IProps {
  task?: string;
}
export default function App({ task = '' }: IProps): JSX.Element {
  const [qna, setQNA] = useState<IQuestionAnswer>(
    getNextQuestion({
      current: undefined,
      answers: { task: [task].filter(Boolean) },
      questions,
      answeredQuestions: [],
    }),
  );
  const onAnswer = useCallback<OnAnswer>(
    (answer: IAnswers) => {
      if (!qna.current) throw new Error('No current question');
      const mergedAnswers = { ...qna.answers, ...answer };

      const nextQNA = getNextQuestion({
        ...qna,
        answers: mergedAnswers,
        answeredQuestions: [
          ...qna.answeredQuestions,
          { question: qna.current, answer },
        ],
      });
      setQNA(nextQNA);
      return mergedAnswers;
    },
    [qna, setQNA],
  );
  const { onSet } = useHistory('previous');
  useEffect(() => {
    if (!qna.current)
      onSet({
        answers: qna.answers,
        executions: qna.answeredQuestions.filter(
          ({ question }) => question.type === 'execute',
        ),
      });
  }, [onSet, qna.answers, qna.answeredQuestions, qna.current]);
  return (
    <>
      <Summary answeredQuestions={qna.answeredQuestions} />
      {qna.current && (
        <QuestionWrapper
          {...qna.current}
          onAnswer={onAnswer}
          answers={qna.answers}
        />
      )}
    </>
  );
}
