import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/toasts/toast-context/toast-context';
import { CONSTANTS } from '@/constants/constants';
import { formatStatisticsData } from '@/services/format';
import { Grid, Stack, Text } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import type { FC } from 'react';
import React, { useEffect } from 'react';

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
    <Grid columns={2} borderStyle="solid" borderWidth="hairline" width="100%">
      {statisticsGridData.map((item) => (
        <Stack
          flexDirection={'column'}
          alignItems={'center'}
          padding={'sm'}
          borderStyle="solid"
          borderWidth="hairline"
          key={`statistic-stack-${item.label}`}
        >
          <Text variant="code">{item.value}</Text>
          <Text
            variant="code"
            bold
            size="smallest"
            className={atoms({
              flexWrap: 'nowrap',
            })}
          >
            {item.label}
          </Text>
        </Stack>
      ))}
    </Grid>
  );
};

export default StatisticsGrid;
