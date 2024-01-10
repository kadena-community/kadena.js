import { MenuButton } from '@/components/Common/Layout/partials/Sidebar/MenuButton';
import { MenuLinkButton } from '@/components/Common/Layout/partials/Sidebar/MenuLinkButton';
import { useLayoutContext } from '@/context';
import { useIsMatchingMediaQuery } from '@/hooks/use-is-mobile-media-query';
import { Accordion } from '@kadena/react-ui';
import { breakpoints } from '@kadena/react-ui/theme';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import {
  gridItemMenuStyle,
  subMenuContentStyle,
  subMenuTitleClass,
} from './styles.css';

export const Menu: FC = () => {
  const router = useRouter();

  const {
    activeMenu,
    isMenuOpen,
    setActiveMenuIndex,
    setIsMenuOpen,
  } = useLayoutContext();
  const isMediumScreen = useIsMatchingMediaQuery(`${breakpoints.sm}`);

  const handleCloseMenu = () => {
    setActiveMenuIndex(undefined);
    setIsMenuOpen(false);
  };

  const handleOnClick = () => {
    if (!isMediumScreen) {
      setIsMenuOpen(false);
    }
  };

  if (!isMenuOpen) return null;

  return (
    <div className={gridItemMenuStyle}>
      <>
        <div className={subMenuTitleClass}>
          <span>{activeMenu?.title}</span>
          <MenuButton icon={'Close'} onClick={handleCloseMenu} />
        </div>
        <div className={subMenuContentStyle}>
          <Accordion.Root>
            {activeMenu?.items?.map((item, index) => (
                <MenuLinkButton
                    title={item.title}
                    key={`menu-link-${index}`}
                    href={item.href}
                    active={item.href === router.pathname}
                    onClick={handleOnClick}
                />
            ))}
          </Accordion.Root>
        </div>
      </>
    </div>
  );
};
