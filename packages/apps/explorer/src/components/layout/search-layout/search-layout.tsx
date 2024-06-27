import { useNetworkInfoQuery } from '@/__generated__/sdk';
import Footer from '@/components/footer/footer';
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
      <Stack
        className={atoms({ flexDirection: 'column' })}
        flexDirection={{ xs: 'column-reverse', sm: 'column' }}
        gap={'xxl'}
        alignItems={'center'}
      >
        <StatisticsComponent data={statisticsGridData} />
      </Stack>

      <main className={layoutWrapperClass}>{children}</main>
      <Footer />
    </div>
  );
};

export default SearchLayout;
