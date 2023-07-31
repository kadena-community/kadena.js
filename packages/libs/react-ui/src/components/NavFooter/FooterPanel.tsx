import { footerPanel } from './Footer.css';

import React, { FC } from 'react';

export interface IFooterPanelProps {
  children: React.ReactNode;
}

export const FooterPanel: FC<IFooterPanelProps> = ({ children }) => {
  return (
    <div className={footerPanel} data-testid="kda-footer-panel">
      {children}
    </div>
  );
};
