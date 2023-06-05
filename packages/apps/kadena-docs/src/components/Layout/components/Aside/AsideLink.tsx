import { AsideItem, AsideItemLink } from './AsideStyles';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { useRouter } from 'next/router';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
  label: string;
  isActive: boolean;
}

export const AsideLink: FC<IProps> = ({ children, href, label, isActive }) => {
  const router = useRouter();

  const handleAnalytics = (): void => {
    analyticsEvent(EVENT_NAMES['click:asidemenu_deeplink'], {
      label,
      url: href,
    });
  };

  const handleSlide = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    document?.querySelector(href)?.scrollIntoView({
      behavior: 'smooth',
    });

    setTimeout(async () => {
      await router.push(href);
    }, 500);
  };
  return (
    <AsideItem onClick={handleAnalytics}>
      <AsideItemLink href={href} onClick={handleSlide} isActive={isActive}>
        {label}
      </AsideItemLink>
      {children}
    </AsideItem>
  );
};
