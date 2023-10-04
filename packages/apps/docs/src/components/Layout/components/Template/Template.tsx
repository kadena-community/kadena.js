import { breakpoints } from '@kadena/react-ui/theme';

import { Footer } from '../Footer';
import { Menu, MenuBack } from '../Menu';
import { SideMenu } from '../SideMenu';

import { useMenu, useWindowScroll } from '@/hooks';
import type { IMenuItem } from '@/types/Layout';
import type { FC, ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useMedia } from 'react-use';

interface IProps {
  children?: ReactNode;
  menuItems: IMenuItem[];
  layout?: 'normal' | 'landing';
  hideSideMenu?: boolean;
}

export const Template: FC<IProps> = ({
  children,
  menuItems,
  layout = 'normal',
  hideSideMenu = false,
}) => {
  const { isMenuOpen, closeMenu } = useMenu();
  const isMediumDevice = useMedia(breakpoints.md);
  const [{ y }] = useWindowScroll();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [initialTopSpacing, setInitialTopSpacing] = useState('');
  const [style, setStyle] = useState<React.CSSProperties>({});
  // Enable position if it's minimum medium device size
  // and layout type is landing
  const enablePositioning = layout === 'landing' && isMediumDevice;

  useEffect(() => {
    if (!enablePositioning) return;
    // Get the initial paddingTop value at initial rendering
    const paddingTop = getComputedStyle(
      mainContentRef.current as HTMLDivElement,
    )?.paddingTop;
    // When we get css from computed style it comes with `px` suffix
    const onlyValue = paddingTop.split('px')[0];
    setInitialTopSpacing(onlyValue);

    // Reset style value when we navigate to different pages
    return () => {
      setStyle({});
    };
  }, []);

  useEffect(() => {
    if (!mainContentRef.current || !enablePositioning) {
      return;
    }

    // From the initial top spacing subtract the window scroll value
    //  to maintain the scrolling effect
    const paddingValue = parseInt(initialTopSpacing) - (y || 0);

    if (paddingValue <= 0) return;
    setStyle({
      paddingTop: paddingValue,
    });
  }, [y, initialTopSpacing, enablePositioning]);

  return (
    <>
      <MenuBack isOpen={isMenuOpen} onClick={closeMenu} />
      <Menu
        dataCy="menu"
        isOpen={isMenuOpen}
        inLayout={!hideSideMenu}
        layout={layout}
        ref={mainContentRef}
        style={style}
      >
        <SideMenu closeMenu={closeMenu} menuItems={menuItems} />
      </Menu>
      {children}
      <Footer />
    </>
  );
};
