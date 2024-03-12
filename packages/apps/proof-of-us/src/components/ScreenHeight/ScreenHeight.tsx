import { Stack } from '@kadena/react-ui';
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
