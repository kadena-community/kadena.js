import { Button, Heading, Stack } from '@kadena/react-components';

import React, { ChangeEvent, FC, useState } from 'react';

export const Subscribe: FC = () => {
  const [email, setEmail] = useState<string>('');
  const handleSubscribe = async () => {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    console.log(res.status);
    const body = await res.json();

    console.log(body);
  };

  const handleFormState = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const value = target.value ?? '';
    setEmail(value);
  };

  return (
    <section>
      <Heading as="h6">Recieve important developer updates</Heading>
      <Stack spacing="2xs">
        <input
          onChange={handleFormState}
          placeholder="Email address"
          aria-label="fill in your email address to subscribe"
        />
        <Button onClick={handleSubscribe} title="Subscribe">
          Subscribe
        </Button>
      </Stack>
    </section>
  );
};
