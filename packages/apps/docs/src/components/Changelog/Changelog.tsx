import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { Package } from './Package';

export const Changelog: FC = () => {
  return (
    <Stack flexDirection="column" gap="xxxl">
      <Package />
      <Package />
    </Stack>
  );
};
