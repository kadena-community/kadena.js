import {
  colorVariants,
  linkBoxClass,
  linkClass,
  spanClass,
} from './Footer.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface IFooterLinkItemProps {
  title: string;
  href?: string;
  color?: keyof typeof colorVariants;
}

export const FooterLinkItem: FC<IFooterLinkItemProps> = ({
  title,
  href,
  color = 'default',
}) => {
  const classLinkList = classNames(linkClass, colorVariants[color]);
  const classSpanList = classNames(spanClass, colorVariants[color]);
  return (
    <div className={linkBoxClass}>
      {href !== undefined ? (
        <a className={classLinkList} href={`#${href}`}>
          {title}
        </a>
      ) : (
        <span className={classSpanList}>{title}</span>
      )}
    </div>
  );
};
