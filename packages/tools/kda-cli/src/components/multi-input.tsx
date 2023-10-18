import { ConfirmInput, TextInput } from '@inkjs/ui';
import { Box, Text } from 'ink';
import React, { useState } from 'react';
import type { IQuestion } from '../questions/questions.js';
import { IntermediateAnswers } from './intermediate-answers.js';

export const MultiInput = ({
  name,
  suggestions,
  onSubmit,
}: IQuestion & { onSubmit: (v: string[]) => void }): ReturnType<typeof Box> => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [answers, setAnswers] = useState<string[]>([]);
  if (isSubmitting)
    return (
      <>
        <IntermediateAnswers answers={answers} />
        <Box flexDirection="row">
          <Text bold>Do you have more capabilities to add? </Text>
          <ConfirmInput
            onCancel={() => {
              onSubmit(answers);
            }}
            onConfirm={() => setIsSubmitting(false)}
          />
        </Box>
      </>
    );
  return (
    <>
      <IntermediateAnswers answers={answers} />
      <TextInput
        key={`${name}-input-${answers.length}`}
        suggestions={suggestions}
        onSubmit={(value: string) => {
          setAnswers([...answers, value]);
          setIsSubmitting(true);
        }}
      />
    </>
  );
};
