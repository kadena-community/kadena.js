import { Button, Heading, Stack, Text } from '@kadena/react-ui';

import { contactLinkClass } from './styles.css';

import Link from 'next/link';
import React, { type FC } from 'react';

export const NotFound: FC = () => {
  return (
    <Stack
      gap="$2"
      paddingTop="$20"
      paddingX={0}
      direction="column"
      alignItems="center"
    >
      <Heading as="h5">Not finding the help you need?</Heading>
      <Text>Contact our support desk.</Text>
      <Link href="/help" passHref legacyBehavior>
        <Button as="a" title="Contact us" className={contactLinkClass}>
          Contact us
        </Button>
      </Link>
    </Stack>
  );
};
