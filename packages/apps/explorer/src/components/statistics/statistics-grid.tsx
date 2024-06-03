import { Grid, Stack, Text } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';

interface ISearchComponentProps {
  data: { label: string; value: string }[];
}

const StatisticsGrid: React.FC<ISearchComponentProps> = ({ data }) => {
  return (
    <Grid columns={2} borderStyle="solid" borderWidth="hairline">
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
          <Text
            variant="code"
            bold
            size="smallest"
            className={atoms({
              flexWrap: 'nowrap',
            })}
          >
            {item.label}
          </Text>
        </Stack>
      ))}
    </Grid>
  );
};

export default StatisticsGrid;
