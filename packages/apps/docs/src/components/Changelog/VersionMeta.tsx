import { Heading, Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

export const VersionMeta: FC = () => {
  return (
    <Stack flexDirection="column" gap="xl">
      <Heading as="h4" variant="h5">
        April 24, 2024
      </Heading>

      <Stack flexDirection="column">
        <Heading as="h4" variant="h5">
          Contributors
        </Heading>
      </Stack>
    </Stack>
  );
};
