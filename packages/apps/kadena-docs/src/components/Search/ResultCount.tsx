import { Text } from '@kadena/react-ui';

import React, { FC } from 'react';

interface IProps {
  count: number;
}

export const ResultCount: FC<IProps> = ({ count }) => {
  return (
    <Text size="md">
      {count} Documentation items related to your search term found in this
      space.
    </Text>
  );
};
