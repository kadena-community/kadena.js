import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { asideClass } from './styles.css';

export const LayoutAside: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack className={asideClass} width="100%">
      {children}
    </Stack>
  );
};
