import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { NotificationSlot } from '..';
import { Stack } from './../../components';
import { Header } from './components/Header/Header';
import { cardWrapperClass, wrapperClass } from './style.css';

export const FocussedLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      className={wrapperClass}
    >
      <NotificationSlot />
      <Stack flexDirection="column" className={cardWrapperClass}>
        <Header />
        <Stack width="100%" flexDirection="column" gap="lg">
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};
