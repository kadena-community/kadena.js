import { type INavHeaderRootProps, NavHeaderContainer } from './NavHeader';
import {
  type INavHeaderContentProps,
  NavHeaderContent,
} from './NavHeaderContent';
import { NavHeaderLink } from './NavHeaderLink';
import {
  type INavHeaderNavigationProps,
  type INavItem,
  NavHeaderNavigation,
} from './NavHeaderNavigation';

import { type FC } from 'react';

export {
  INavHeaderRootProps,
  INavHeaderContentProps,
  INavItem as INavHeaderLinkProps,
  INavHeaderNavigationProps,
};

export interface INavHeaderProps {
  Root: FC<INavHeaderRootProps>;
  Navigation: FC<INavHeaderNavigationProps>;
  Link: FC<INavItem>;
  Content: FC<INavHeaderContentProps>;
}

export const NavHeader: INavHeaderProps = {
  Root: NavHeaderContainer,
  Navigation: NavHeaderNavigation,
  Link: NavHeaderLink,
  Content: NavHeaderContent,
};
