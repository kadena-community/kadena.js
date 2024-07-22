import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/toasts/toast-context/toast-context';
import { CONSTANTS } from '@/constants/constants';
import { formatStatisticsData } from '@/services/format';
import { Grid, Stack, Text } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import {
  boxClass,
  overFlowClass,
} from '../statistics-stack/statistics-stack.css';

interface IStatisticsGridProps {
  inView: boolean;
}

const StatisticsGrid: FC<IStatisticsGridProps> = ({ inView }) => {
  const { addToast } = useToast();
  const {
    data: statisticsData,
    error,
    stopPolling,
    startPolling,
  } = useNetworkInfoQuery();

  useEffect(() => {
    if (error && inView) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of network info data failed',
      });
      stopPolling();
    }
    inView ? startPolling(CONSTANTS.NETWORK_POLLING_RATE) : stopPolling();
  }, [error, inView]);

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);

  return (
    <Grid columns={2} width="100%" gap="xs">
      {statisticsGridData.map((item) => (
        <Stack
          className={boxClass}
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
    </Grid>
  );
};

export default StatisticsGrid;
