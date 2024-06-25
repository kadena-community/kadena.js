import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import { SpireKeyKdacolorLogoWhite } from '@kadena/react-icons/product';
import { Button, Select, SelectItem, Stack, Text } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React, { useState } from 'react';
import type { IStatisticsComponentProps } from '../statistics-component';
import {
  borderStyleClass,
  statisticsSpireKeyClass,
} from './statistics-stack.css';

const StatisticsStack: React.FC<IStatisticsComponentProps> = ({ data }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('Mainnet');

  return (
    <Stack flexDirection={'row'}>
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

        <Stack flexDirection={'row'}>
          <div className={borderStyleClass}>
            <GraphQLQueryDialog />
          </div>

          <div className={borderStyleClass}>
            <Select
              aria-label="Select network"
              defaultSelectedKey={selectedNetwork}
              fontType="code"
              size="lg"
              className={atoms({
                height: '100%',
              })}
              onSelectionChange={(value) =>
                setSelectedNetwork(value.toString())
              }
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
      </Stack>
    </Stack>
  );
};

export default StatisticsStack;
