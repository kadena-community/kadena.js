import React from 'react';
import { Media } from '../layout/media';
import StatisticsGrid from './statistics-grid/statistics-grid';
import StatisticsStack from './statistics-stack/statistics-stack';

export interface IStatisticsComponentProps {
  data: { label: string; value: string }[];
}

const StatisticsComponent: React.FC<IStatisticsComponentProps> = ({ data }) => {
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

export default StatisticsComponent;
