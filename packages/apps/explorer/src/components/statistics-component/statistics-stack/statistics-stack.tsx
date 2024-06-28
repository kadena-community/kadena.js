import { Stack, Text } from '@kadena/react-ui';
import React from 'react';
import type { IStatisticsComponentProps } from '../statistics-component';
import { boxClass } from './statistics-stack.css';

const StatisticsStack: React.FC<IStatisticsComponentProps> = ({ data }) => {
  return (
    <Stack flexDirection={'row'} flex={1} gap="xs">
      {data.map((item) => (
        <Stack
          className={boxClass}
          flex={1}
          flexDirection={'column'}
          alignItems={'center'}
          padding={'sm'}
          key={`statistic-stack-${item.label}`}
        >
          <Text variant="code" bold>
            {item.value}
          </Text>
          <Text size="smallest">{item.label}</Text>
        </Stack>
      ))}
    </Stack>
  );
};

export default StatisticsStack;
