import type { IMenuItem, LayoutType } from '@/Layout';
import { useMenu } from '@/hooks/useMenu/useMenu';
import { SystemIcon } from '@kadena/react-ui';
import classNames from 'classnames';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { globalClass } from '../../global.css';
import { DocsLogo } from '../DocsLogo/DocsLogo';
import { HamburgerMenuToggle } from './HamburgerMenuToggle';
import { NavItemActiveBackground } from './NavItemActiveBackground';
import { SearchButton } from './SearchButton';
import { ThemeToggle } from './ThemeToggle';
import {
  headerButtonClass,
  headerClass,
  headerIconGroupClass,
  hideOnMobileClass,
  innerWrapperClass,
  logoClass,
  navClass,
  navLinkActiveVariant,
  navLinkClass,
  skipNavClass,
  socialGroupClass,
  spacerClass,
  ulClass,
} from './styles.css';
import { useHeaderAnimation } from './useHeaderAnimation';

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
        <div className={logoClass}>
          <Link href="/" passHref aria-label="Go to the home page">
            <DocsLogo overwriteTheme="dark" />
          </Link>
        </div>

        <div className={hideOnMobileClass}>
          <NavItemActiveBackground show={hasPath} ref={backgroundRef} />
          <nav className={navClass}>
            <ul className={ulClass} ref={listRef}>
              {menuItems.map((item) => (
                <li key={item.root}>
                  <Link
                    href={item.root}
                    className={classNames(
                      navLinkClass,
                      navLinkActiveVariant[item.isMenuOpen ? 'true' : 'false'],
                    )}
                  >
                    {item.menu}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className={spacerClass} />

        <section className={classNames(headerIconGroupClass, socialGroupClass)}>
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
        <section className={headerIconGroupClass}>
          <ThemeToggle />
          <div className={hideOnMobileClass}>
            <SearchButton />
          </div>
          <HamburgerMenuToggle
            toggleMenu={toggleMenu}
            isMenuOpen={isMenuOpen}
          />
        </section>
      </div>
    </header>
  );
};
