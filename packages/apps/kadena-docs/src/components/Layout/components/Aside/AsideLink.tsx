import { AsideItem, AsideItemLink } from './AsideStyles';

import React, { FC, MouseEventHandler, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
  label: string;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}

export const AsideLink: FC<IProps> = ({
  children,
  href,
  label,
  isActive,
  onClick,
}) => {
  return (
    <AsideItem>
      <AsideItemLink href={href} onClick={onClick} isActive={isActive}>
        {label}
      </AsideItemLink>
      {children}
    </AsideItem>
  );
};
