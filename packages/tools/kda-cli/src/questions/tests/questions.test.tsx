import { type IAnswers, type IQuestion, getNextQuestion } from '../questions';

import questionsTest, { type TestFn } from 'ava';

interface IContext {
  questions: IQuestion[];
}
const test = questionsTest as TestFn<IContext>;
test.before((t) => {
  t.context.questions = [
    {
      type: 'input',
      message: 'What is your name?',
      name: 'name',
    },
    {
      type: 'select',
      message: 'What food do you like?',
      name: 'food',
      choices: [
        { label: 'Pizza', value: 'pizza' },
        { label: 'Ice-cream', value: 'ice-cream' },
      ],
    },
    {
      type: 'multi-select',
      message: 'What toppings do you want?',
      name: 'continue',
      choices: [
        {
          label: 'Extra cheese',
          value: 'extra-cheese',
        },
        {
          label: 'Mushroom',
          value: 'mushroom',
        },
        {
          label: 'Pepperoni',
          value: 'pepperoni',
        },
        {
          label: 'Pineapple',
          value: 'pineapple',
        },
      ],
      when: ({ food }: IAnswers) => food === 'pizza',
    },
    {
      type: 'execute',
      message: 'Logging the answers',
      name: 'logging',
      action: async (answers: IAnswers) => {
        console.log('question and answers', answers);
        return answers;
      },
    },
  ];
});

const nextQuestionTest = test.macro(
  async (
    t,
    { current, answers }: { current?: number; answers: IAnswers },
    expected: number,
  ) => {
    const { questions } = t.context;
    const res = getNextQuestion({
      current: t.context.questions[current ?? -1],
      questions,
      answers,
      answeredQuestions: [],
    });
    t.is(res.current, t.context.questions[expected]);
  },
);

test(
  'get the first question',
  nextQuestionTest,
  {
    current: undefined,
    answers: {},
  },
  0,
);

test(
  'get the second question',
  nextQuestionTest,
  {
    current: 0,
    answers: { name: 'John' },
  },
  1,
);

test(
  'get the third question',
  nextQuestionTest,
  {
    current: 1,
    answers: { name: 'John', food: 'pizza' },
  },
  2,
);

test(
  'Skip the toppings question',
  nextQuestionTest,
  {
    current: 1,
    answers: { name: 'John', food: 'ice-cream' },
  },
  3,
);

test(
  'log the answers',
  nextQuestionTest,
  {
    current: 3,
    answers: { name: 'John', food: 'pizza', continue: ['mushroom'] },
  },
  4,
);
