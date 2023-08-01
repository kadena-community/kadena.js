import type { INavHeaderContainerProps } from './NavHeader';
import { NavHeaderContainer } from './NavHeader';
import type { INavHeaderLinkProps } from './NavHeaderLink';
import { NavHeaderLink } from './NavHeaderLink';
import type { INavHeaderLogoProps } from './NavHeaderLogo';
import { NavHeaderLogo } from './NavHeaderLogo';

import { FC } from 'react';

export type { INavHeaderContainerProps };

interface INavHeader {
  Root: FC<INavHeaderContainerProps>;
  Logo: FC<INavHeaderLogoProps>;
  Link: FC<INavHeaderLinkProps>;
}

export const NavHeader: INavHeader = {
  Root: NavHeaderContainer,
  Logo: NavHeaderLogo,
  Link: NavHeaderLink,
};
