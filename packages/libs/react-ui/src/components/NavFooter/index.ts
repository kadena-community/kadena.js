import type { IFooterProps } from './Footer';
import { FooterContainer } from './Footer';
import type { IFooterIconButtonProps } from './FooterIconButton';
import { FooterIconButton } from './FooterIconButton';
import type { IFooterLinkProps } from './FooterLink';
import { FooterLink } from './FooterLink';
import type { IFooterPanelProps } from './FooterPanel';
import { FooterPanel } from './FooterPanel';

import { FC } from 'react';

export {
  IFooterProps as INavFooterRootProps,
  IFooterIconButtonProps as INavFooterIconButtonProps,
  IFooterLinkProps as INavFooterLinkProps,
  IFooterPanelProps as INavFooterPanelProps,
};

export interface INavFooterProps {
  Root: FC<IFooterProps>;
  Panel: FC<IFooterPanelProps>;
  Link: FC<IFooterLinkProps>;
  IconButton: FC<IFooterIconButtonProps>;
}

export const NavFooter: INavFooterProps = {
  Root: FooterContainer,
  Panel: FooterPanel,
  Link: FooterLink,
  IconButton: FooterIconButton,
};
