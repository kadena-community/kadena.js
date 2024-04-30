import { useMenu } from '@/hooks/useMenu/useMenu';
import type { IMenuItem, LayoutType } from '@kadena/docs-tools';
import {
  NavHeader,
  NavHeaderButtonLink,
  NavHeaderLink,
  NavHeaderLinkList,
  Stack,
  SystemIcon,
} from '@kadena/react-ui';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import { globalClass } from '../../global.css';
import { DocsLogo } from '../DocsLogo/DocsLogo';
import { HamburgerMenuToggle } from './HamburgerMenuToggle';
import { SearchButton } from './SearchButton';
import { ThemeToggle } from './ThemeToggle';
import {
  headerClass,
  hideOnTabletClass,
  navLinkClass,
  skipNavClass,
  socialsClass,
} from './styles.css';

interface IProps {
  menuItems: IMenuItem[];
  layout?: LayoutType;
}

export const Header: FC<IProps> = ({ menuItems, layout = 'full' }) => {
  const { toggleMenu, isMenuOpen } = useMenu();
  const { pathname } = useRouter();

  return (
    <div className={classNames(globalClass, headerClass)}>
      <a className={skipNavClass} href="#maincontent">
        Skip to main content
      </a>

      <NavHeader
        logo={
          <Link href="/" aria-label="Go to the home page">
            <DocsLogo overwriteTheme="dark" height={32} />
          </Link>
        }
        activeHref={pathname}
      >
        <NavHeaderLinkList className={hideOnTabletClass}>
          {menuItems.map((item) => (
            <NavHeaderLink key={item.root} asChild>
              <Link href={item.root} className={navLinkClass}>
                {item.menu}
              </Link>
            </NavHeaderLink>
          ))}
        </NavHeaderLinkList>

        <Stack justifyContent="flex-end" gap="md" flex={1}>
          <NavHeaderButtonLink
            className={socialsClass}
            href="https://twitter.com/kadena_io"
            title="Go to our X"
          >
            <SystemIcon.Twitter />
          </NavHeaderButtonLink>

          <NavHeaderButtonLink
            className={socialsClass}
            href="https://github.com/kadena-community"
            title="Go to our Github"
          >
            <SystemIcon.Github />
          </NavHeaderButtonLink>
          <ThemeToggle />

          <div className={hideOnTabletClass}>
            <SearchButton />
          </div>

          <HamburgerMenuToggle
            toggleMenu={toggleMenu}
            isMenuOpen={isMenuOpen}
          />
        </Stack>
      </NavHeader>
    </div>
  );
};
