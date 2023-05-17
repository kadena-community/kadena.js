import { Button, Heading, Stack, Text } from '@kadena/react-components';

import { isEmailValid } from '@/utils';
import React, { ChangeEvent, FC, MouseEvent, useState } from 'react';

/**
 * @TODO: when the loading state story is implemented in the UI lib,
 * we want to have a loading state in this component
 *
 * @TODO: Add notification component when it is finished instead of just Text component
 */
export const Subscribe: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const disabled = !email || hasError;
  const success = message && !hasError;

  const handleSubscribe = async (
    e: MouseEvent<HTMLButtonElement, SubmitEvent>,
  ) => {
    e.preventDefault();

    try {
      if (disabled) return;
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const body = await res.json();

      if (body.status > 200) {
        setHasError(true);
      }
      setMessage(body.message);
    } catch (e) {
      setHasError(true);
      setMessage('There was a problem, please try again later');
    }
  };

  const handleFormState = (event: ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event;
    const email = currentTarget.value ?? '';
    setHasError(false);
    setMessage(null);

    if (!isEmailValid(email)) {
      setHasError(true);
    }
    setEmail(email);
  };

  return (
    <section data-cy="subscribe">
      <Heading as="h6">Recieve important developer updates</Heading>

      {!success ? (
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
                disabled={disabled}
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
