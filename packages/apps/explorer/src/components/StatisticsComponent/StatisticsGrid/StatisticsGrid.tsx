import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { CONSTANTS } from '@/constants/constants';
import { useQueryContext } from '@/context/queryContext';
import { networkInfo } from '@/graphql/queries/network-info.graph';
import { formatStatisticsData } from '@/services/format';
import { Grid, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import {
  boxClass,
  overFlowClass,
} from '../StatisticsStack/statisticsStack.css';

interface IStatisticsGridProps {
  inView: boolean;
}

export const StatisticsGrid: FC<IStatisticsGridProps> = ({ inView }) => {
  const { addToast } = useToast();
  const { setQueries } = useQueryContext();

  const variables = {
    pollInterval: CONSTANTS.NETWORK_POLLING_RATE,
  };

  const {
    data: statisticsData,
    error,
    stopPolling,
    startPolling,
  } = useNetworkInfoQuery(variables);

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

  useEffect(() => {
    setQueries([{ query: networkInfo, variables }]);
  }, []);

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
