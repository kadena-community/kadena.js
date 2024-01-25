import type { ApolloError } from '@apollo/client';
import { Box, Notification, SystemIcon } from '@kadena/react-ui';
import React from 'react';

interface IErrorBoxProps {
  error: ApolloError;
}

export const ErrorBox = (props: IErrorBoxProps): JSX.Element => {
  const { error } = props;

  let errorTitle = 'Unknown Error Occured';
  let errorMessage = error.message;
  let errorExtra;

  if (error.graphQLErrors?.length > 0) {
    const mainError = error.graphQLErrors[0];

    if (mainError.extensions) {
      errorTitle = (mainError.extensions.message as string) ?? errorTitle;
      errorMessage =
        (mainError.extensions.description as string) ?? errorMessage;

      if (!mainError.extensions.description) {
        errorExtra = JSON.stringify(mainError.extensions.data);
      }
    }
  }

  if (error.message === 'Unexpected response: "Internal Server Error"') {
    errorMessage =
      'The server encountered an unexpected error. Are you sure the GraphQL server is running?';
  }

  return (
    <Notification intent="negative" icon={<SystemIcon.Close />} role="status">
      {errorTitle}
      <Box margin="sm" />
      {errorMessage}
      {errorExtra !== undefined && (
        <>
          <Box margin="sm" />
          <code>{errorExtra}</code>
        </>
      )}
    </Notification>
  );
};
