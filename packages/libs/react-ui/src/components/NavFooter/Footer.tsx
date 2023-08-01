import { darkThemeClass } from '@theme/vars.css';
import { containerClass } from './Footer.css';

import React, { FC } from 'react';

export interface IFooterProps {
  children: React.ReactNode;
  darkMode?: boolean;
}

export const FooterContainer: FC<IFooterProps> = ({
  children,
  darkMode = false,
}) => {

  const footerContent = (    
    <footer className={containerClass} data-testid="kda-footer">
      {children}
    </footer>
  )

  if (darkMode) {
    return (
      <div className={darkThemeClass}>
        {footerContent}
      </div>
    )
  }

  return footerContent;
};
