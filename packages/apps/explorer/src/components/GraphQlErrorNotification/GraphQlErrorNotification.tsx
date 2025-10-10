import type { ApolloError } from '@apollo/client';
import { Notification, NotificationHeading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { wrapperClass } from './style.css';

interface IProps {
  error?: ApolloError;
}

export const GraphQlErrorNotification: FC<IProps> = ({ error }) => {
  if (!error) return;

  return (
    <Notification role="alert" type="inlineStacked" intent="negative">
      <NotificationHeading>Error</NotificationHeading>
      {error.graphQLErrors.map((err, index) => (
        <Stack key={index} flexDirection="column" className={wrapperClass}>
          <div>{err.message}</div>
          <div>{err.extensions?.message as string}</div>
        </Stack>
      ))}
    </Notification>
  );
};
