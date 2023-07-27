import type { FooterVariant, IFooterProps } from './Footer';
import { FooterContainer } from './Footer';
import type { IFooterIconItemProps } from './FooterIconItem';
import { FooterIconItem } from './FooterIconItem';
import type { IFooterLinkItemProps } from './FooterLinkItem';
import { FooterLinkItem } from './FooterLinkItem';
import type { IFooterPanelProps } from './FooterPanel';
import { FooterPanel } from './FooterPanel';

import { FC } from 'react';

export {
  IFooterProps,
  IFooterPanelProps,
  IFooterLinkItemProps,
  IFooterIconItemProps,
  FooterVariant,
};

interface IFooter {
  Root: FC<IFooterProps>;
  Panel: FC<IFooterPanelProps>;
  LinkItem: FC<IFooterLinkItemProps>;
  IconItem: FC<IFooterIconItemProps>;
}

export const Footer: IFooter = {
  Root: FooterContainer,
  Panel: FooterPanel,
  LinkItem: FooterLinkItem,
  IconItem: FooterIconItem,
};
