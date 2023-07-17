import { vars } from '../../styles';

import { colorVariants, linkBoxClass, linkClass } from './Footer.css';

import React, { FC } from 'react';
import classNames from 'classnames';

export type Target = '_self' | '_blank';
export interface IFooterLinkItemProps {
  children: React.ReactNode;
  // title?: string;
  // href?: string;
  // target?: Target;
  color?: keyof typeof colorVariants;
}

export const FooterLinkItem: FC<IFooterLinkItemProps> = ({
  children,
  color = 'default',
}) => {
  type ColorKey = keyof typeof vars.colors;
  const getColor = (color: string): string => {
    const contrast: ColorKey = `$${color}Contrast` as ColorKey;
    console.log(contrast);
    if (color === 'default') {
      return vars.colors.$neutral3;
    }

    if (color === 'inverted') {
      return vars.colors.$neutral2;
    }

    return vars.colors[contrast];
  };

  const colorStyles = {
    color: getColor(color),
    textDecorationColor: getColor(color),
  };

  const clones = React.Children.map(children, (child) => {
    // @ts-ignore
    return React.cloneElement(child, {
      className: linkClass,
      style: colorStyles,
    });
  });

  // if(!child) {
  //  return
  // }

  const classList = classNames(linkClass, colorVariants[color]);

  return (
    <div className={linkBoxClass} data-testid="kda-footer-link-item">
      <a className={classList}>{clones}</a>
    </div>
  );
};
