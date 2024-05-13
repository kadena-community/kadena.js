import { MonoHub } from '@kadena/react-icons/system';
import { Button, Select, SelectItem, Stack, Text } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React, { useState } from 'react';

interface IStatisticsStackProps {
  data: { label: string; value: string }[];
}

const StatisticsStack: React.FC<IStatisticsStackProps> = ({ data }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('Mainnet');

  const borderStyle = atoms({
    borderStyle: 'solid',
    borderWidth: 'hairline',
    display: 'flex',
  });

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
          <Text variant="code">{item.label}</Text>
        </Stack>
      ))}

      <div className={borderStyle}>
        <Button variant="transparent" endVisual={<MonoHub />}>
          Graph
        </Button>
      </div>

      <div className={borderStyle}>
        <Select
          defaultSelectedKey={selectedNetwork}
          fontType="code"
          size="lg"
          className={atoms({ height: '100%' })}
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
