import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { Media } from '@/components/Layout/media';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { CONSTANTS } from '@/constants/constants';
import { useQueryContext } from '@/context/queryContext';
import { networkInfo } from '@/graphql/queries/network-info.graph';
import { formatStatisticsData } from '@/services/format';
import { Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { boxClass, overFlowClass } from './statisticsStack.css';

export const StatisticsStack: FC = () => {
  const { addToast } = useToast();
  const { setQueries } = useQueryContext();

  const variables = {
    pollInterval: CONSTANTS.NETWORK_POLLING_RATE,
  };

  const {
    data: statisticsData,
    error,
    stopPolling,
  } = useNetworkInfoQuery(variables);

  useEffect(() => {
    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of network info data failed',
      });
      stopPolling();
    }
  }, [error]);

  useEffect(() => {
    setQueries([{ query: networkInfo, variables }]);
  }, []);

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
