import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { useLayout } from '../LayoutProvider';
import { Stack } from './../../../../components';
import { KLogoText } from './../../../SideBarLayout/components/Logo/KLogoText';

export const Header: FC = () => {
  const { setHeaderContentRef, setHeaderAsideRef } = useLayout();
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;
    setHeaderContentRef(leftRef.current);
    setHeaderAsideRef(rightRef.current);
  }, [leftRef.current, rightRef.current]);

  return (
    <Stack
      width="100%"
      marginBlockStart="md"
      marginBlockEnd="xxxl"
      alignItems="center"
    >
      <KLogoText />
      <Stack flex={1} ref={leftRef} />
      <Stack as="aside" marginInlineEnd="xs" ref={rightRef} />
    </Stack>
  );
};
