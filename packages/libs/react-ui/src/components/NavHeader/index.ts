import type { INavHeaderRootProps } from './NavHeader';
import { NavHeaderContainer } from './NavHeader';
import type { INavHeaderContentProps } from './NavHeaderContent';
import { NavHeaderContent } from './NavHeaderContent';
import type { INavHeaderLinkProps } from './NavHeaderLink';
import { NavHeaderLink } from './NavHeaderLink';
import type { INavHeaderNavigationProps } from './NavHeaderNavigation';
import { NavHeaderNavigation } from './NavHeaderNavigation';
import { INavHeaderSelectProps, NavHeaderSelect } from './NavHeaderSelect';

import type { FC } from 'react';

export {
  INavHeaderRootProps,
  INavHeaderContentProps,
  INavHeaderLinkProps,
  INavHeaderNavigationProps,
  INavHeaderSelectProps,
};

interface INavHeaderProps {
  Root: FC<INavHeaderRootProps>;
  Navigation: FC<INavHeaderNavigationProps>;
  Link: FC<INavHeaderLinkProps>;
  Content: FC<INavHeaderContentProps>;
  Select: FC<INavHeaderSelectProps>;
}

export const NavHeader: INavHeaderProps = {
  Root: NavHeaderContainer,
  Navigation: NavHeaderNavigation,
  Link: NavHeaderLink,
  Content: NavHeaderContent,
  Select: NavHeaderSelect,
};
