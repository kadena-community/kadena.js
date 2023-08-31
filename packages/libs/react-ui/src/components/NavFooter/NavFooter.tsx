import { containerClass } from './NavFooter.css';
import { type INavFooterPanelProps } from './NavFooterPanel';

import { darkThemeClass } from '@theme/vars.css';
import React, { type FC, type FunctionComponentElement } from 'react';

export interface INavFooterRootProps {
  children: FunctionComponentElement<INavFooterPanelProps>[];
  darkMode?: boolean;
}

export const NavFooterContainer: FC<INavFooterRootProps> = ({
  children,
  darkMode = false,
}) => {
  const footerContent = (
    <footer className={containerClass} data-testid="kda-footer">
      {children}
    </footer>
  );

  if (darkMode) {
    return <div className={darkThemeClass}>{footerContent}</div>;
  }

  return footerContent;
};
