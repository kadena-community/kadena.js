import { footerPanel } from './NavFooter.css';
import { INavFooterIconButtonProps } from './NavFooterIconButton';
import { INavFooterLinkProps } from './NavFooterLink';

import React, { FC, FunctionComponentElement } from 'react';

export interface INavFooterPanelProps {
  children: FunctionComponentElement<
    INavFooterLinkProps | INavFooterIconButtonProps
  >[];
}

export const NavFooterPanel: FC<INavFooterPanelProps> = ({ children }) => {
  return (
    <div className={footerPanel} data-testid="kda-footer-panel">
      {children}
    </div>
  );
};
