import { footerPanel, footerPanelVariants } from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface IFooterPanelProps {
  children: React.ReactNode;
  variant: keyof typeof footerPanelVariants;
}

export const FooterPanel: FC<IFooterPanelProps> = ({ children, variant }) => {
  const classPanelList = classNames(footerPanel, footerPanelVariants[variant]);
  return (
    <div className={classPanelList} data-testid="kda-footer-panel">
      {children}
    </div>
  );
};
