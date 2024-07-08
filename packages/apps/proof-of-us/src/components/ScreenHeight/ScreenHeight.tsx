import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import { totalScreenHeightClass } from './style.css';

export const ScreenHeight: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack
      className={totalScreenHeightClass}
      flexDirection="column"
      as="section"
      paddingInline="lg"
      gap="md"
    >
      {children}
    </Stack>
  );
};
