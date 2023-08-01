import { Button, Heading, Stack, Text } from '@kadena/react-ui';

import Link from 'next/link';
import React, { FC } from 'react';

export const NotFound: FC = () => {
  return (
    <Stack
      spacing="$2"
      paddingTop="$20"
      paddingX={0}
      direction="column"
      alignItems="center"
    >
      <Heading as="h5">Not finding the help you need?</Heading>
      <Text>Contact our support desk.</Text>
      <Link href="/help" passHref legacyBehavior>
        <Button variant="primary" as="a" title="Contact us">
          Contact us
        </Button>
      </Link>
    </Stack>
  );
};
