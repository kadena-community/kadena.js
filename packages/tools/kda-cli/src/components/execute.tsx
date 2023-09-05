import type { IAnswers, IQuestion } from '../questions/questions.js';

import { Spinner } from '@inkjs/ui';
import { Text } from 'ink';
import React, { useEffect, useState } from 'react';

export const Execute = ({
  message,
  action,
  answers,
  onSubmit,
}: IQuestion & {
  answers: IAnswers;
  onSubmit: (v: string | string[]) => void;
}): ReturnType<typeof Spinner> => {
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (action === undefined) {
      setError('No action provided');
      return;
    }
    action(answers)
      .then((result: IAnswers) => {
        return onSubmit(result as unknown as string | string[]);
      })
      .catch((error: Error) => {
        setError(error.message);
      });
  }, []);
  if (error !== undefined) return <Text color="red">{error}</Text>;
  return <Spinner label={message} />;
};
