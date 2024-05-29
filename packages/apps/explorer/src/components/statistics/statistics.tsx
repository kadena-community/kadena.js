import { Media } from '@/media';
import React from 'react';
import StatisticsGrid from './statistics-grid';
import StatisticsStack from './statistics-stack';

interface IStatisticsProps {
  data: { label: string; value: string }[];
}

const Statistics: React.FC<IStatisticsProps> = ({ data }) => {
  return (
    <>
      <Media greaterThanOrEqual="xs">
        <StatisticsStack data={data} />
      </Media>

      <Media lessThan="xs">
        <StatisticsGrid data={data} />
      </Media>
    </>
  );
};

export default Statistics;
