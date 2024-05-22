import { MonoHub } from '@kadena/react-icons/system';
import { Button, Select, SelectItem, Stack, Text } from '@kadena/react-ui';
import React, { useState } from 'react';
import { borderStyleClass } from './style.css';

interface IStatisticsStackProps {
  data: { label: string; value: string }[];
}

const StatisticsStack: React.FC<IStatisticsStackProps> = ({ data }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('Mainnet');

  return (
    <Stack flexDirection={'row'}>
      {data.map((item) => (
        <Stack
          flexDirection={'column'}
          alignItems={'center'}
          padding={'sm'}
          borderStyle="solid"
          borderWidth="hairline"
          key={`statistic-stack-${item.label}`}
        >
          <Text variant="code">{item.value}</Text>
          <Text variant="code" bold size="smallest">
            {item.label}
          </Text>
        </Stack>
      ))}

      <div className={borderStyleClass}>
        <Button variant="transparent" endVisual={<MonoHub />}>
          Graph
        </Button>
      </div>

      <div className={borderStyleClass}>
        <Select
          defaultSelectedKey={selectedNetwork}
          fontType="code"
          size="lg"
          onSelectionChange={(value) => setSelectedNetwork(value.toString())}
        >
          <SelectItem key={'Mainnet'} textValue="Mainnet">
            Mainnet
          </SelectItem>
          <SelectItem key={'Testnet'} textValue="Testnet">
            Testnet
          </SelectItem>
        </Select>
      </div>
    </Stack>
  );
};

export default StatisticsStack;
