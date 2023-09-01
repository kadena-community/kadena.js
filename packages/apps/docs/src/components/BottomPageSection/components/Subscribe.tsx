import {
  Button,
  Heading,
  Notification,
  Stack,
  TextField,
} from '@kadena/react-ui';

import { useSubscribe } from './useSubscribe';

import React, { type FC } from 'react';

/**
 * @TODO: when the loading state story is implemented in the UI lib,
 * we want to have a loading state in this component
 *
 */
export const Subscribe: FC = () => {
  const { handleFormState, handleSubscribe, message, canSubmit, hasSuccess } =
    useSubscribe();

  return (
    <section data-cy="subscribe">
      <Stack direction="column" gap="$sm">
        <Heading as="h6">Receive important developer updates</Heading>

        {!hasSuccess ? (
          <>
            <form>
              <Stack gap="$sm">
                <TextField
                  inputProps={{
                    id: 'email',
                    type: 'email',
                    placeholder: 'Email address',
                    onChange: handleFormState,
                    'aria-label': 'Fill in email address',
                    leftIcon: 'At',
                  }}
                />
                <Button
                  disabled={!canSubmit}
                  onClick={handleSubscribe}
                  title="Subscribe"
                >
                  Subscribe
                </Button>
              </Stack>
            </form>

            {Boolean(message) && (
              <Notification.Root color="warning" expanded>
                {message}
              </Notification.Root>
            )}
          </>
        ) : (
          Boolean(message) && (
            <Notification.Root color="positive" expanded>
              {message}
            </Notification.Root>
          )
        )}
      </Stack>
    </section>
  );
};
