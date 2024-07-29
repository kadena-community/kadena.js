import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';

export const NoSearchResults: FC = () => {
  return (
    <Stack justifyContent="center">
      <h3>No search results</h3>
    </Stack>
  );
};
