import { Button, Heading, Stack, Text } from '@kadena/react-components';

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
      <Heading as="h6">Recieve important developer updates</Heading>

      {!hasSuccess ? (
        <>
          <form>
            <Stack spacing="2xs">
              <input
                type="text"
                onChange={handleFormState}
                placeholder="Email address"
                aria-label="fill in your email address to subscribe"
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
          <Text bold={true}>{message}</Text>
        </>
      ) : (
        <Text bold={true}>{message}</Text>
      )}
    </section>
  );
};
