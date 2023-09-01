//  TODO: Find a better source for the last modified date (https://app.asana.com/0/1204649083736950/1204804598558906/f)

//import { Stack, Text } from '@kadena/react-ui';
//import { formatISODate } from '@/utils/dates';
//import React, { FC } from 'react';
import { FC } from 'react';

interface IProps {
  date?: Date;
}

export const LastModifiedDate: FC<IProps> = ({ date }) => {
  return null;
  /*
  if (!date) return null;
  const dateString = formatISODate(date);
  return (
    <Stack justifyContent="flex-end">
      <Text size="sm">
        Last updated <time dateTime={dateString}>{dateString}</time>
      </Text>
    </Stack>
  );
  */
};
