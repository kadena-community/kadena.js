import { AsideItem } from './AsideStyles';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
  label: string;
  isActive?: boolean;
}

export const AsideLink: FC<IProps> = ({
  children,
  href,
  label,
  isActive = false,
}) => {
  const handleAnalytics = (): void => {
    analyticsEvent(EVENT_NAMES['click:asidemenu_deeplink'], {
      label,
      url: href,
    });
  };
  return (
    <AsideItem onClick={handleAnalytics} isActive={isActive}>
      <Link href={href}>{label}</Link>
      {children}
    </AsideItem>
  );
};
