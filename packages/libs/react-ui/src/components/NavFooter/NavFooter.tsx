import { containerClass } from './NavFooter.css';
import { INavFooterPanelProps } from './NavFooterPanel';

import { darkThemeClass } from '@theme/vars.css';
import React, { FC, FunctionComponentElement } from 'react';

export interface INavFooterContainerProps {
  children: FunctionComponentElement<INavFooterPanelProps>[];
  darkMode?: boolean;
}

export const NavFooterContainer: FC<INavFooterContainerProps> = ({
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
