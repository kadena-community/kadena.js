import type { INavHeaderRootProps } from './NavHeader';
import { NavHeaderRoot } from './NavHeader';
import type { INavHeaderContentProps } from './NavHeaderContent';
import { NavHeaderContent } from './NavHeaderContent';
import { NavHeaderLink } from './NavHeaderLink';
import type {
  INavHeaderNavigationProps,
  INavItem,
} from './NavHeaderNavigation';
import { NavHeaderNavigation } from './NavHeaderNavigation';

import type { FC } from 'react';

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
  Root: NavHeaderRoot,
  Navigation: NavHeaderNavigation,
  Link: NavHeaderLink,
  Content: NavHeaderContent,
};
