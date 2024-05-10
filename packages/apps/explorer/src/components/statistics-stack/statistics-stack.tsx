import { Button, Select, SelectItem, Stack } from '@kadena/react-ui';
import React from 'react';

interface IStatisticsStackProps {
  data: { label: string; value: number }[];
}

const StatisticsStack: React.FC<IStatisticsStackProps> = ({ data }) => {
  return (
    <Stack flexDirection={'row'} gap={'md'} alignItems={'center'}>
      {data.map((item) => (
        <Stack flexDirection={'column'}>
          <div>{item.value}</div>
          <div>{item.label}</div>
        </Stack>
      ))}

      <Button variant="transparent">Graph</Button>
      <Select variant="default">
        <SelectItem>'Mainnet'</SelectItem>
        <SelectItem>'Testnet'</SelectItem>
      </Select>
    </Stack>
  );
};

export default StatisticsStack;
