import type { INavHeaderContainerProps } from './NavHeader';
import { NavHeaderContainer } from './NavHeader';
import type { INavHeaderContentProps } from './NavHeaderContent';
import { NavHeaderContent } from './NavHeaderContent';
import type { INavHeaderLinkProps } from './NavHeaderLink';
import { NavHeaderLink } from './NavHeaderLink';
import type { INavHeaderNavigationProps } from './NavHeaderNavigation';
import { NavHeaderNavigation } from './NavHeaderNavigation';

import { FC } from 'react';

export interface INavHeaderProps {
  Root: FC<INavHeaderContainerProps>;
  Navigation: FC<INavHeaderNavigationProps>;
  Link: FC<INavHeaderLinkProps>;
  Content: FC<INavHeaderContentProps>;
}

export const NavHeader: INavHeaderProps = {
  Root: NavHeaderContainer,
  Navigation: NavHeaderNavigation,
  Link: NavHeaderLink,
  Content: NavHeaderContent,
};
