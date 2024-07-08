import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { Media } from '@/components/layout/media';
import { formatStatisticsData } from '@/services/format';
import { Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { boxClass, overFlowClass } from './statistics-stack.css';

const StatisticsStack: FC = () => {
  const { data: statisticsData } = useNetworkInfoQuery({
    pollInterval: 5000,
  });

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);

  return (
    <Media greaterThanOrEqual="md" style={{ width: '100%' }}>
      <Stack flexDirection={'row'} flex={1} gap="xs">
        {statisticsGridData.map((item) => (
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
            <Text size="smallest" className={overFlowClass}>
              {item.label}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Media>
  );
};

export default StatisticsStack;
