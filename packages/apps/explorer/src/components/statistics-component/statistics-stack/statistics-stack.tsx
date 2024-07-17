import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { Media } from '@/components/layout/media';
import { useToast } from '@/components/toasts/toast-context/toast-context';
import { CONSTANTS } from '@/constants/constants';
import { formatStatisticsData } from '@/services/format';
import { Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { boxClass, overFlowClass } from './statistics-stack.css';

const StatisticsStack: FC = () => {
  const { addToast } = useToast();
  const {
    data: statisticsData,
    error,
    stopPolling,
  } = useNetworkInfoQuery({
    pollInterval: CONSTANTS.NETWORK_POLLING_RATE,
  });

  useEffect(() => {
    if (error) {
      stopPolling();
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of network info data failed',
      });
    }
  }, [error]);

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
