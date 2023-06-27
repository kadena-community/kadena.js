export interface IAnswers {
  [key: string]: string | boolean | string[];
}

interface IChoice {
  label: string;
  value: string;
}
export interface IQuestion {
  type:
    | 'input'
    | 'select'
    | 'multi-select'
    | 'confirm'
    | 'multi-input'
    | 'rerun'
    | 'execute';
  name: string;
  message: string;
  defaultValue?: string | string[];
  choices?: IChoice[];
  suggestions?: string[];
  when?: (answers: IAnswers) => boolean;
  action?: (answers: IAnswers) => Promise<IAnswers>;
}
export interface IQuestionAnswer {
  current?: IQuestion;
  questions: IQuestion[];
  answers: IAnswers;
  answeredQuestions: { question: IQuestion; answer: IAnswers }[];
}

const findNextQuestion = (
  question: IQuestion,
  questions: IQuestion[],
  answers: IAnswers,
): IQuestion | undefined => {
  const index = questions.indexOf(question);
  const next = questions[index + 1];
  if (next?.when && !next.when(answers))
    return findNextQuestion(next, questions, answers);
  return next;
};
export const getNextQuestion = ({
  current,
  questions,
  answers,
  answeredQuestions,
}: IQuestionAnswer): IQuestionAnswer => {
  if (!current)
    return {
      current: findNextQuestion(
        { type: 'input', message: '', name: '' },
        questions,
        answers,
      ),
      questions,
      answers,
      answeredQuestions,
    };

  return {
    current: findNextQuestion(current, questions, answers),
    questions,
    answers,
    answeredQuestions,
  };
};
