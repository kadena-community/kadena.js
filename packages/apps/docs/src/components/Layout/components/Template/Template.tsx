import { useMenu } from '@/hooks/useMenu/useMenu';
import { useWindowScroll } from '@/hooks/useWindowScroll';
import type { IMenuItem } from '@kadena/docs-tools';
import { breakpoints } from '@kadena/kode-ui/styles';
import type { FC, ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useMedia } from 'react-use';
import { Footer } from '../Footer/Footer';
import { Menu } from '../Menu/Menu';
import { MenuBack } from '../Menu/MenuBack';
import { SideMenu } from '../SideMenu/SideMenu';

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
  const isMediumDevice = useMedia(breakpoints.md, true);
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

    setInitialTopSpacing(`${parseInt(onlyValue, 10) + y}`);

    // Reset style value when we navigate to different pages

    return () => {
      setStyle({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mainContentRef.current || !enablePositioning) {
      setStyle({ paddingTop: 0 });
      return;
    }

    // From the initial top spacing subtract the window scroll value
    //  to maintain the scrolling effect
    const paddingValue = parseInt(initialTopSpacing) - (y || 0);

    if (paddingValue <= 0 || isNaN(paddingValue)) return;
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
