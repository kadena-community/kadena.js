import {
  colorVariants,
  linkBoxClass,
  linkClass,
  spanClass,
} from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export type Target = '_self' | '_blank';
export interface IFooterLinkItemProps {
  title: string;
  href?: string;
  target?: Target;
  color?: keyof typeof colorVariants;
}

export const FooterLinkItem: FC<IFooterLinkItemProps> = ({
  title,
  href,
  target = '_blank',
  color = 'default',
}) => {
  const classLinkList = classNames(linkClass, colorVariants[color]);
  const classSpanList = classNames(spanClass, colorVariants[color]);
  return (
    <div className={linkBoxClass}>
      {href !== undefined ? (
        <a className={classLinkList} href={`${href}`} target={target}>
          {title}
        </a>
      ) : (
        <span className={classSpanList}>{title}</span>
      )}
    </div>
  );
};
