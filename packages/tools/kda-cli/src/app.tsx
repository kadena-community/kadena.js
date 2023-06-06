import { OnAnswer, QuestionWrapper } from './components/question.js';
import { Summary } from './components/summary.js';
import { questions } from './questions/init.js';
import {
  getNextQuestion,
  IAnswers,
  IQuestionAnswer,
} from './questions/questions.js';

import React, { useCallback, useState } from 'react';

interface IProps {
  task?: string;
}
export default function App({ task = '' }: IProps): JSX.Element {
  const [qna, setQNA] = useState<IQuestionAnswer>({
    current: questions[0],
    answers: {},
    questions,
    answeredQuestions: [],
  });
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
  return (
    <>
      <Summary
        answers={qna.answers}
        answeredQuestions={qna.answeredQuestions}
      />
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
