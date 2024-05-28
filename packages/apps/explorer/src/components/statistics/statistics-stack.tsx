import { SpireKeyKdacolorLogoWhite } from '@kadena/react-icons/product';
import { MonoHub } from '@kadena/react-icons/system';
import { Button, Select, SelectItem, Stack, Text } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React, { useState } from 'react';
import { borderStyleClass, statisticsSpireKeyClass } from './statistics.css';

interface IStatisticsStackProps {
  data: { label: string; value: string }[];
  isTablet?: boolean;
}

const StatisticsStack: React.FC<IStatisticsStackProps> = ({
  data,
  isTablet,
}) => {
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
          {isTablet ? '' : 'Graph'}
        </Button>
      </div>

      <div className={borderStyleClass}>
        <Select
          defaultSelectedKey={selectedNetwork}
          fontType="code"
          size="lg"
          className={atoms({
            height: '100%',
          })}
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
      <div className={statisticsSpireKeyClass}>
        <Button
          variant="transparent"
          startVisual={<SpireKeyKdacolorLogoWhite />}
        />
      </div>
    </Stack>
  );
};

export default StatisticsStack;
