import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { Media } from '@/components/layout/media';
import StatisticsComponent from '@/components/statistics-component/statistics-component';
import { formatStatisticsData } from '@/services/format';
import { Stack } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { documentStyle, layoutWrapperClass } from './../styles.css';

interface IProps {
  children?: ReactNode;
}

export const SearchLayout: FC<IProps> = ({ children }: IProps) => {
  // Ideally we would pull this data once and then make calcs client-side
  const { data: statisticsData } = useNetworkInfoQuery({
    pollInterval: 5000,
  });

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);

  return (
    <div className={documentStyle}>
      <Media greaterThanOrEqual="sm">
        <Stack
          className={atoms({ flexDirection: 'column' })}
          gap={'xxl'}
          alignItems={'center'}
        >
          <StatisticsComponent data={statisticsGridData} />
        </Stack>
      </Media>

      <Media lessThan="sm">
        <Stack
          className={atoms({ flexDirection: 'column-reverse' })}
          gap={'xxl'}
          alignItems={'center'}
          paddingBlockStart={'xxl'}
        >
          <StatisticsComponent data={statisticsGridData} />
        </Stack>
      </Media>

      <main className={layoutWrapperClass}>{children}</main>
    </div>
  );
};

export default SearchLayout;
