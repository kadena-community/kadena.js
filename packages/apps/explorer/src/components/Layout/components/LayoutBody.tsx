import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { bodyClass } from './styles.css';

export const LayoutBody: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack flexDirection="column" className={bodyClass} width="100%">
      {children}
    </Stack>
  );
};
