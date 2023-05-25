import { Stack, Text } from '@kadena/react-components';

import { formatISODate } from '@/utils/dates';
import React, { FC } from 'react';

interface IProps {
  date: Date;
}

export const LastModifiedDate: FC<IProps> = ({ date }) => {
  if (!date) return null;
  const dateString = formatISODate(date);
  return (
    <Stack justifyContent="flex-end">
      <Text size="sm">
        Last updated <time dateTime={dateString}>{dateString}</time>
      </Text>
    </Stack>
  );
};
