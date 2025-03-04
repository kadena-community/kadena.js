import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { NotificationSlot } from '..';
import { Stack } from './../../components';
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
        {children}
      </Stack>
    </Stack>
  );
};
