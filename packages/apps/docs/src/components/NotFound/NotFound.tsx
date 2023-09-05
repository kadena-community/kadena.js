import { Box, Button, Heading, Stack, Text } from '@kadena/react-ui';

import { contactLinkClass } from './styles.css';

import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

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
      <Box marginTop="$2">
        <Button title="Contact us" asChild>
          <Link href="/help">Contact us</Link>
        </Button>
      </Box>
    </Stack>
  );
};
