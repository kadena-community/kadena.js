import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import { networkConstants } from '@/constants/network';
import { useRedirectOnNetworkChange } from '@/hooks/network/redirect';
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
  const [selectedNetwork, setSelectedNetwork] = useState(
    networkConstants.mainnet01.label,
  );

  useRedirectOnNetworkChange(selectedNetwork);

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
              onSelectionChange={(value: any) =>
                setSelectedNetwork(value.toString())
              }
            >
              <SelectItem
                key={networkConstants.mainnet01.key}
                textValue={networkConstants.mainnet01.label}
              >
                {networkConstants.mainnet01.label}
              </SelectItem>
              <SelectItem
                key={networkConstants.testnet04.key}
                textValue={networkConstants.testnet04.label}
              >
                {networkConstants.testnet04.label}
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
