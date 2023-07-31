import { Button, Heading, Text } from '@kadena/react-ui';

import { Section } from './styles';

import Link from 'next/link';
import React, { FC } from 'react';

export const NotFound: FC = () => {
  return (
    <Section direction="column" alignItems="center">
      <Heading as="h5">Not finding the help you need?</Heading>
      <Text>Contact our support desk.</Text>
      <Link href="/help" passHref legacyBehavior>
        <Button as="a" title="Contact us">
          Contact us
        </Button>
      </Link>
    </Section>
  );
};
