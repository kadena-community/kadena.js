import { Stack, Text } from '@kadena/react-components';

import { formatISODate } from '@/utils/dates';
import React, { FC } from 'react';

interface IProps {
  time: number;
}

export const LastModifiedDate: FC<IProps> = ({ time }) => {
  const dateString = formatISODate(new Date(time));
  return (
    <Stack justifyContent="flex-end">
      <Text size="sm">
        Last updated <time dateTime={dateString}>{dateString}</time>
      </Text>
    </Stack>
  );
};
