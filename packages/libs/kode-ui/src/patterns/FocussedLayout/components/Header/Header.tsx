import type { FC, ReactElement } from 'react';
import React, { useEffect, useRef } from 'react';
import { useLayout } from '../LayoutProvider';
import { Stack } from './../../../../components';
import { KLogoText } from './../../../SideBarLayout/components/Logo/KLogoText';

interface IProps {
  logo?: ReactElement;
}

export const Header: FC<IProps> = ({ logo }) => {
  const { setHeaderContentRef, setHeaderAsideRef } = useLayout();
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const ShowLogo = () => {
    return logo ? logo : <KLogoText />;
  };

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
      {ShowLogo()}
      <Stack flex={1} ref={leftRef} />
      <Stack
        as="aside"
        marginInlineEnd="xs"
        justifyContent="flex-end"
        textAlign="right"
        ref={rightRef}
      />
    </Stack>
  );
};
