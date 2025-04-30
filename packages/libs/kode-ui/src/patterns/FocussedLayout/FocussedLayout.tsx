import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import { NotificationSlot } from '..';
import { Stack } from './../../components';
import { Header } from './components/Header/Header';
import { useLayout } from './components/LayoutProvider';
import { cardWrapperClass, wrapperClass } from './style.css';

export const FocussedLayout: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setTopbannerRef } = useLayout();

  useEffect(() => {
    if (!ref?.current) return;
    setTopbannerRef(ref.current);
  }, [ref.current]);

  return (
    <Stack
      width="100%"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      className={wrapperClass}
    >
      <Stack ref={ref} width="100%" />
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
