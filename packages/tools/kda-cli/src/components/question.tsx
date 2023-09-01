import { useHistory } from '../hooks/use-history.js';
import { type IAnswers, type IQuestion } from '../questions/questions.js';

import { Execute } from './execute.js';
import { MultiInput } from './multi-input.js';
import { Rerun } from './rerun.js';

import { ConfirmInput, MultiSelect, Select, TextInput } from '@inkjs/ui';
import { Box, Text } from 'ink';
import React from 'react';

export type OnAnswer = (answer: IAnswers) => IAnswers | void;

const getComponent = (
  type: string,
):
  | typeof MultiSelect
  | typeof Select
  | typeof MultiInput
  | typeof Execute
  | typeof Rerun
  | typeof ConfirmInput
  | typeof TextInput => {
  switch (type) {
    case 'multi-select':
      return MultiSelect;
    case 'select':
      return Select;
    case 'multi-input':
      return MultiInput;
    case 'execute':
      return Execute;
    case 'rerun':
      return Rerun;
    case 'confirm':
      return ConfirmInput;
    case 'input':
    default:
      return TextInput;
  }
};

const resolveDefaultValue = (
  defaultValue: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(defaultValue)) return defaultValue[0];
  return defaultValue;
};
const getDefaultValue = (
  history: unknown,
  defaultValue: string | string[] | undefined,
): string | undefined => {
  if (!Array.isArray(history)) return resolveDefaultValue(defaultValue);
  if (history[0] === undefined) return resolveDefaultValue(defaultValue);
  return history[0];
};
export const QuestionWrapper = ({
  message,
  name,
  type,
  choices = [],
  onAnswer,
  defaultValue,
  answers,
  action,
}: IQuestion & { onAnswer: OnAnswer; answers: IAnswers }): ReturnType<
  typeof Box
> => {
  const Component = getComponent(type);
  const { history, onSave } = useHistory(name);

  const suggestions = Array.isArray(history) ? history : [];
  return (
    <Box marginX={2} marginY={1} flexDirection="column">
      <Text>{message}</Text>
      <Component
        key={name}
        name={name}
        placeholder={getDefaultValue(history, defaultValue)}
        options={choices}
        suggestions={suggestions}
        action={action}
        type={type}
        message={message}
        onCancel={() => {
          onSave(false);
          onAnswer({ [name]: false });
        }}
        onConfirm={() => {
          onSave(true);
          onAnswer({ [name]: true });
        }}
        onSubmit={(value: string | string[]) => {
          onSave(value);
          onAnswer({ [name]: value });
        }}
        answers={answers}
      />
    </Box>
  );
};
