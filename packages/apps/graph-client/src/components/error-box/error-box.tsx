import type { ApolloError } from '@apollo/client';
import { Box, Notification } from '@kadena/react-ui';
import React from 'react';

interface IErrorBoxProps {
  error: ApolloError;
}

export const ErrorBox = (props: IErrorBoxProps): JSX.Element => {
  const { error } = props;

  let errorTitle = 'Unknown Error Occured';
  let errorMessage = error.message;
  let errorExtra;

  if (error.graphQLErrors.length > 0) {
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

  return (
    <Notification.Root color="negative" icon="Close">
      {errorTitle}
      <Box marginBottom="$4" />
      {errorMessage}
      {errorExtra !== undefined && (
        <>
          <Box marginBottom="$4" />
          <code>{errorExtra}</code>
        </>
      )}
    </Notification.Root>
  );
};
