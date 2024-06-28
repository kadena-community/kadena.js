import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { formatStatisticsData } from '@/services/format';
import React from 'react';
import StatisticsStack from './statistics-stack/statistics-stack';

export interface IStatisticsComponentProps {
  data: { label: string; value: string }[];
}

const StatisticsComponent: React.FC = () => {
  // Ideally we would pull this data once and then make calcs client-side
  const { data: statisticsData } = useNetworkInfoQuery({
    pollInterval: 5000,
  });

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);

  return <StatisticsStack data={statisticsGridData} />;
};

export default StatisticsComponent;
