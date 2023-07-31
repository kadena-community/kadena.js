import {
  Button,
  Notification,
  NotificationBody,
  SystemIcons,
  TextField,
} from '@kadena/react-components';
import { Heading, Stack } from '@kadena/react-ui';

import { useSubscribe } from './useSubscribe';

import React, { FC } from 'react';

/**
 * @TODO: when the loading state story is implemented in the UI lib,
 * we want to have a loading state in this component
 *
 * @TODO: Add notification component when it is finished instead of just Text component
 */
export const Subscribe: FC = () => {
  const { handleFormState, handleSubscribe, message, canSubmit, hasSuccess } =
    useSubscribe();

  return (
    <section data-cy="subscribe">
      <Stack direction="column" spacing="$sm">
        <Heading as="h6">Receive important developer updates</Heading>

        {!hasSuccess ? (
          <>
            <form>
              <Stack spacing="$sm">
                <TextField
                  inputProps={{
                    type: 'email',
                    placeholder: 'Email address',
                    onChange: handleFormState,
                    'aria-label': 'Fill in email address',
                    leftPanel: () => <SystemIcons.At />,
                  }}
                />
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  onClick={handleSubscribe}
                  title="Subscribe"
                >
                  Subscribe
                </Button>
              </Stack>
            </form>

            {Boolean(message) && (
              <Notification color="warning" expand>
                <NotificationBody>{message}</NotificationBody>
              </Notification>
            )}
          </>
        ) : (
          Boolean(message) && (
            <Notification color="positive" expand>
              <NotificationBody>{message}</NotificationBody>
            </Notification>
          )
        )}
      </Stack>
    </section>
  );
};
