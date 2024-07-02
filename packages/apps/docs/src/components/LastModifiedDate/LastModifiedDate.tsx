//  TODO: Find a better source for the last modified date (https://app.asana.com/0/1204649083736950/1204804598558906/f)
import { formatISODate } from '@/utils/dates';
import { Stack, Text } from '@kadena/kode-ui';
import { isValid } from 'date-fns';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  date?: Date;
}

export const LastModifiedDate: FC<IProps> = ({ date }) => {
  if (!isValid(date) || !date) return null;
  const dateString = formatISODate(date);
  return (
    <Stack justifyContent="flex-end">
      <Text size="smallest">
        Last updated <time dateTime={dateString}>{dateString}</time>
      </Text>
    </Stack>
  );
};
