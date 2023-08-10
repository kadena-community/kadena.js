import { footerPanel } from './NavFooter.css';

import React, { FC } from 'react';

export interface INavFooterPanelProps {
  children: React.ReactNode;
}

export const NavFooterPanel: FC<INavFooterPanelProps> = ({ children }) => {
  return (
    <div className={footerPanel} data-testid="kda-footer-panel">
      {children}
    </div>
  );
};
