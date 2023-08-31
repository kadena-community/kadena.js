import { type INavFooterRootProps, NavFooterContainer } from './NavFooter';
import {
  type INavFooterIconButtonProps,
  NavFooterIconButton,
} from './NavFooterIconButton';
import { type INavFooterLinkProps, NavFooterLink } from './NavFooterLink';
import { type INavFooterPanelProps, NavFooterPanel } from './NavFooterPanel';

import { type FC } from 'react';

export {
  INavFooterRootProps,
  INavFooterIconButtonProps,
  INavFooterLinkProps,
  INavFooterPanelProps,
};

export interface INavFooterProps {
  Root: FC<INavFooterRootProps>;
  Panel: FC<INavFooterPanelProps>;
  Link: FC<INavFooterLinkProps>;
  IconButton: FC<INavFooterIconButtonProps>;
}

export const NavFooter: INavFooterProps = {
  Root: NavFooterContainer,
  Panel: NavFooterPanel,
  Link: NavFooterLink,
  IconButton: NavFooterIconButton,
};
