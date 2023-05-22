import { AsideItem } from './AsideStyles';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
  label: string;
}

export const AsideLink: FC<IProps> = ({ children, href, label }) => {
  const handleAnalytics = () => {
    analyticsEvent(EVENT_NAMES['click:asidemenu_deeplink'], {
      label,
      href,
    });
  };
  return (
    <AsideItem onClick={handleAnalytics}>
      <Link href={href}>{label}</Link>
      {children}
    </AsideItem>
  );
};
