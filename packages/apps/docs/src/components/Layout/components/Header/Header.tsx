import { IconButton, SystemIcon } from '@kadena/react-ui';

import { globalClass } from '../../global.css';
import {
  InnerWrapper,
  NavLink,
  StyledLogoWrapper,
  StyledNav,
  StyledUl,
} from '../styles';
import { DocsLogo } from '..';

import { HamburgerMenuToggle } from './HamburgerMenuToggle';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { SearchButton } from './SearchButton';
import { HeaderIconGroup, HideOnMobile } from './styles';
import {
  headerButtonClass,
  headerClass,
  innerWrapperClass,
  skipNavClass,
  socialGroupClass,
  spacerClass,
} from './styles.css';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderAnimation } from './useHeaderAnimation';

import { useMenu } from '@/hooks';
import { IMenuItem, LayoutType } from '@/types/Layout';
import classNames from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  menuItems: IMenuItem[];
  layout?: LayoutType;
}

export const Header: FC<IProps> = ({ menuItems, layout = 'full' }) => {
  const { hasPath, listRef, backgroundRef } = useHeaderAnimation();
  const { toggleMenu, isMenuOpen } = useMenu();

  return (
    <header className={classNames(globalClass, headerClass)}>
      <a className={skipNavClass} href="#maincontent">
        Skip to main content
      </a>
      <div className={innerWrapperClass}>
        <StyledLogoWrapper>
          <Link href="/" passHref>
            <DocsLogo overwriteTheme="dark" />
          </Link>
        </StyledLogoWrapper>

        <HideOnMobile>
          <NavItemActiveBackground show={hasPath} ref={backgroundRef} />
          <StyledNav>
            <StyledUl ref={listRef}>
              {menuItems.map((item) => (
                <li key={item.root}>
                  <NavLink href={item.root} active={item.isMenuOpen}>
                    {item.menu}
                  </NavLink>
                </li>
              ))}
            </StyledUl>
          </StyledNav>
        </HideOnMobile>
        <div className={spacerClass} />

        <section className={socialGroupClass}>
          <a
            href="https://twitter.com/kadena_io"
            title="Go to our Twitter"
            className={classNames(headerButtonClass)}
          >
            <SystemIcon.Twitter />
          </a>
          <a
            href="https://github.com/kadena-community"
            title="Go to our Github"
            className={classNames(headerButtonClass)}
          >
            <SystemIcon.Github />
          </a>
        </section>
        <HeaderIconGroup>
          <ThemeToggle />
          <HideOnMobile>
            <SearchButton />
          </HideOnMobile>
          <HamburgerMenuToggle
            toggleMenu={toggleMenu}
            isMenuOpen={isMenuOpen}
          />
        </HeaderIconGroup>
      </div>
    </header>
  );
};
