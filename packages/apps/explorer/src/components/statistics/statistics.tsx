import React from 'react';
import { Media } from '../layout/media';
import StatisticsGrid from './statistics-grid';
import StatisticsStack from './statistics-stack';

interface IStatisticsProps {
  data: { label: string; value: string }[];
}

const Statistics: React.FC<IStatisticsProps> = ({ data }) => {
  return (
    <>
      <Media greaterThanOrEqual="sm">
        <StatisticsStack data={data} />
      </Media>

      <Media lessThan="sm">
        <StatisticsGrid data={data} />
      </Media>
    </>
  );
};

export default Statistics;
