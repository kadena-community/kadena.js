import { Button, Heading, Input, Notification, Stack } from '@kadena/react-ui';

import { useSubscribe } from './useSubscribe';

import type { FC } from 'react';
import React from 'react';

/**
 * @TODO: when the loading state story is implemented in the UI lib,
 * we want to have a loading state in this component
 *
 */
export const Subscribe: FC = () => {
  const {
    handleFormState,
    handleSubscribe,
    message,
    canSubmit,
    hasSuccess,
    isLoading,
  } = useSubscribe();

  return (
    <section data-cy="subscribe">
      <Stack direction="column" gap="$sm">
        <Heading as="h6">Receive important developer updates</Heading>

        {!hasSuccess ? (
          <>
            <form>
              <Stack gap="$sm">
                <Input
                  id="email"
                  icon="At"
                  onChange={handleFormState}
                  placeholder="Email address"
                  outlined
                  type="email"
                  aria-label="Fill in email address"
                />

                <Button
                  disabled={!canSubmit}
                  onClick={handleSubscribe}
                  title="Subscribe"
                  loading={isLoading}
                >
                  Subscribe
                </Button>
              </Stack>
            </form>

            {Boolean(message) && (
              <Notification.Root color="warning" expanded variant="outlined">
                {message}
              </Notification.Root>
            )}
          </>
        ) : (
          Boolean(message) && (
            <Notification.Root color="positive" expanded variant="outlined">
              {message}
            </Notification.Root>
          )
        )}
      </Stack>
    </section>
  );
};
