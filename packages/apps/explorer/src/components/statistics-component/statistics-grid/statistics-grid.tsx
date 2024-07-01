import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { Media } from '@/components/layout/media';
import { formatStatisticsData } from '@/services/format';
import { Grid, Stack, Text } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import type { FC } from 'react';
import React from 'react';

const StatisticsGrid: FC = () => {
  const { data: statisticsData } = useNetworkInfoQuery({
    pollInterval: 5000,
  });

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);

  return (
    <Media lessThan="md">
      <Grid columns={2} borderStyle="solid" borderWidth="hairline">
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
    </Media>
  );
};

export default StatisticsGrid;
