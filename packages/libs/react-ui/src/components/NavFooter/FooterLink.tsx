import { linkBoxClass, linkClass } from './Footer.css';

import React, { FC } from 'react';

export type Target = '_self' | '_blank';
export interface IFooterLinkProps {
  children: React.ReactNode;
}

export const FooterLink: FC<IFooterLinkProps> = ({ children }) => {
  const colorStyles = {
    color: 'inherit',
    textDecorationColor: 'inherit',
  };

  const clones = React.Children.map(children, (child) => {
    return React.cloneElement(
      child as React.ReactElement<
        any,
        string | React.JSXElementConstructor<any>
      >,
      {
        className: [linkClass],
        style: colorStyles,
      },
    );
  });

  return (
    <div className={linkBoxClass} data-testid="kda-footer-link-item">
      <span className={linkClass}>{clones}</span>
    </div>
  );
};
