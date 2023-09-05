import { useHistory } from '../hooks/use-history.js';
import { questions } from '../questions/init.js';
import type { IAnswers, IQuestion } from '../questions/questions.js';

import { QuestionWrapper } from './question.js';
import { SummaryView } from './summary.js';

import React, { useCallback, useState } from 'react';

const getExecutionAction = ({ name }: IQuestion): (() => Promise<IAnswers>) =>
  questions.find((question) => question.name === name)
    ?.action as unknown as () => Promise<IAnswers>;
interface IAnsweredQuestion {
  question: IQuestion;
  answer: string | string[];
}
interface IExecution {
  question: IQuestion;
  answers: IAnswers;
  executions: IAnsweredQuestion[];
}
export const Rerun = (): ReturnType<typeof SummaryView> => {
  const { history: h } = useHistory('previous');
  const history = h as unknown as IExecution;
  const [answers, setAnswers] = useState(history.answers);
  const [currentExecution, setCurrentExecution] = useState(
    history.executions[0],
  );

  const onAnswer = useCallback(
    (answer: IAnswers) => {
      setAnswers({
        ...answers,
        ...answer,
      });
      const executionIndex = history.executions.findIndex(
        (execution: IAnsweredQuestion): boolean =>
          execution.question.name === currentExecution.question.name,
      );
      const nextExecution = history.executions[executionIndex + 1];
      setCurrentExecution(nextExecution);
    },
    [currentExecution?.question?.name, answers],
  );

  if (currentExecution === undefined) {
    return (
      <SummaryView
        answeredQuestions={history.executions.map(
          ({ question }: { question: IQuestion }) => ({
            question,
            answer: answers[question.name] as unknown as IAnswers,
          }),
        )}
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
