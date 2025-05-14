import type { FC, PropsWithChildren, ReactElement } from 'react';
import React, { useEffect, useRef } from 'react';
import { NotificationSlot } from '..';
import { Stack } from './../../components';
import { Header } from './components/Header/Header';
import { useLayout } from './components/LayoutProvider';
import { cardWrapperClass, wrapperClass } from './style.css';

interface IProps {
  logo?: ReactElement;
}

export const FocussedLayout: FC<PropsWithChildren<IProps>> = ({
  children,
  logo,
}) => {
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
      justifyContent="center"
      alignItems="center"
      className={wrapperClass}
    >
      <Stack ref={ref} width="100%" />
      <NotificationSlot />
      <Stack flexDirection="column" className={cardWrapperClass}>
        <Header logo={logo} />
        <Stack width="100%" flexDirection="column" gap="lg">
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};
