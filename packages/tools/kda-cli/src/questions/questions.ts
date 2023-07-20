import { readFileSync } from 'fs';

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
  profile?: string;
}

const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value === '';
  if (!Array.isArray(value)) return false;
  return value.length === 0;
};

const findNextQuestion = (
  question: IQuestion,
  questions: IQuestion[],
  answers: IAnswers,
): IQuestion | undefined => {
  const index = questions.indexOf(question);
  const next = questions[index + 1];

  const answer = answers[next?.name];
  if (!isEmptyValue(answer)) return findNextQuestion(next, questions, answers);
  if (next?.when && !next.when(answers))
    return findNextQuestion(next, questions, answers);
  return next;
};

const mergeProfileAnswers = (answers: IAnswers, profile?: string): IAnswers => {
  if (typeof profile !== 'string' || profile === '') return answers;
  const dataString = readFileSync(profile, 'utf8');
  try {
    const profileAnswers = JSON.parse(dataString);
    return {
      ...answers,
      ...profileAnswers,
    };
  } catch (e) {
    console.error('Could not parse profile', e);
    return answers;
  }
};
export const getNextQuestion = ({
  current,
  questions,
  answers,
  answeredQuestions,
  profile,
}: IQuestionAnswer): IQuestionAnswer => {
  if (!current) {
    const mergedAnswers = mergeProfileAnswers(answers, profile);
    return {
      current: findNextQuestion(
        { type: 'input', message: '', name: '' },
        questions,
        mergedAnswers,
      ),
      questions,
      answers: mergedAnswers,
      answeredQuestions,
    };
  }

  return {
    current: findNextQuestion(current, questions, answers),
    questions,
    answers,
    answeredQuestions,
  };
};
