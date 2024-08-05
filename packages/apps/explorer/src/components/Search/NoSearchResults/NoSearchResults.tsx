import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';

export const NoSearchResults: FC = () => {
  return (
    <Stack justifyContent="center">
      <Heading as="h3">No search results</Heading>
    </Stack>
  );
};
