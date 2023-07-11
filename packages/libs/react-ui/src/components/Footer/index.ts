import { FooterContainer, IFooterProps } from './Footer';
import { FooterIconItem, IFooterIconItemProps } from './FooterIconItem';
import { FooterLinkItem, IFooterLinkItemProps } from './FooterLinkItem';
import { FooterPanel, IFooterPanelProps } from './FooterPanel';

import { FC } from 'react';

export {
  IFooterProps,
  IFooterPanelProps,
  IFooterLinkItemProps,
  IFooterIconItemProps,
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
