import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Stack } from './../../../../components';

export const RightAsideFooter: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack as="footer" gap={'md'} width="100%" justifyContent="flex-end">
      {children}
    </Stack>
  );
};
