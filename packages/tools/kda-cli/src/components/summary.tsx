import { Box, Text } from 'ink';
import React from 'react';
import type { HistoryValue } from '../hooks/use-history.js';
import type { IQuestionAnswer } from '../questions/questions.js';

const Answer = ({
  value,
}: {
  value: HistoryValue;
}): ReturnType<typeof Text> => {
  if (Array.isArray(value)) {
    return (
      <>
        {value.map((v, i) => (
          <Text color="green" key={v + i}>
            {JSON.stringify(v, null, 2)}
          </Text>
        ))}
      </>
    );
  }
  return <Text color="green">{JSON.stringify(value, null, 2)}</Text>;
};

export const SummaryView = ({
  answeredQuestions,
}: {
  answeredQuestions: IQuestionAnswer['answeredQuestions'];
}): ReturnType<typeof Box> => (
  <>
    {answeredQuestions.map(({ question, answer }) => {
      const values = Object.values(answer);
      return (
        <Box
          key={question.name}
          flexDirection="column"
          marginX={2}
          marginTop={1}
        >
          <Text>{question.message}</Text>
          {values.map((value: HistoryValue) => (
            <Answer key={JSON.stringify(value)} value={value} />
          ))}
        </Box>
      );
    })}
  </>
);

interface ISummaryProps {
  answeredQuestions: IQuestionAnswer['answeredQuestions'];
}
export const Summary = ({
  answeredQuestions,
}: ISummaryProps): ReturnType<typeof SummaryView> => {
  return <SummaryView answeredQuestions={answeredQuestions} />;
};
