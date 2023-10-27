import { expect, test } from 'vitest';
import {
  getNextQuestion,
  type IAnswers,
  type IQuestion,
} from '../questions.ts';

const questions: IQuestion[] = [
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
test('First question', () => {
  const result = getNextQuestion({
    current: undefined,
    questions: questions,
    answers: {},
    answeredQuestions: [],
  });
  expect(result.current).toEqual(questions[0]);
});

test('Second question', () => {
  const result = getNextQuestion({
    current: questions[0],
    questions: questions,
    answers: { name: 'John' },
    answeredQuestions: [],
  });
  expect(result.current).toEqual(questions[1]);
});

test('get Third question', () => {
  const result = getNextQuestion({
    current: questions[1],
    questions: questions,
    answers: { name: 'John', food: 'pizza' },
    answeredQuestions: [],
  });
  expect(result.current).toEqual(questions[2]);
});

test('Skip the topings question', () => {
  const result = getNextQuestion({
    current: questions[1],
    questions: questions,
    answers: { name: 'John', food: 'ice-cream' },
    answeredQuestions: [],
  });
  expect(result.current).toEqual(questions[3]);
});

test('Log al the answers', () => {
  const result = getNextQuestion({
    current: questions[2],
    questions: questions,
    answers: { name: 'John', food: 'pizza', continue: ['mushroom'] },
    answeredQuestions: [],
  });
  console.log(result);
  expect(result.current).toEqual(questions[3]);
});
