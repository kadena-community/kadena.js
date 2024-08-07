import { MonoAlternateEmail } from '@kadena/kode-icons';
import {
  Button,
  Heading,
  Notification,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { useSubscribe } from './useSubscribe';

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
      <Stack flexDirection="column" gap="sm">
        <Heading as="h6" transform="uppercase">
          Receive important developer updates
        </Heading>

        {!hasSuccess ? (
          <>
            <form>
              <Stack gap="sm" paddingBlock="xs">
                <TextField
                  id="email"
                  startVisual={<MonoAlternateEmail />}
                  onChange={handleFormState}
                  placeholder="Email address"
                  type="email"
                  aria-label="Fill in email address"
                />

                <Button
                  type="submit"
                  isDisabled={!canSubmit}
                  onClick={handleSubscribe}
                  title="Subscribe"
                  isLoading={isLoading}
                >
                  Subscribe
                </Button>
              </Stack>
            </form>

            {Boolean(message) && (
              <Notification intent="warning" role="status">
                {message}
              </Notification>
            )}
          </>
        ) : (
          Boolean(message) && (
            <Notification intent="positive" role="status">
              {message}
            </Notification>
          )
        )}
      </Stack>
    </section>
  );
};
