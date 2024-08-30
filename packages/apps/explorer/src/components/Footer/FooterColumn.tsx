import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { Heading, Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { FooterLink } from './FooterLink';
import { footerColumnClass, isClosedClass } from './style.css';

interface IProps {
  data: IMenuConfigItem;
  isOpen?: boolean;
}

export const FooterColumn: FC<IProps> = ({ data, isOpen }) => {
  const handleAnalyticsForClick = (item: { url: string; label: string }) => {
    analyticsEvent(EVENT_NAMES['click:nav_footerlink'], item);
  };

  return (
    <Stack
      className={classNames(footerColumnClass, {
        [isClosedClass]: !isOpen,
      })}
      marginBlock="sm"
      flexDirection="column"
      gap="sm"
      marginInlineEnd="md"
    >
      <Heading as="h6">{data.label}</Heading>
      {data.children.map((item, idx) => (
        <FooterLink
          onClick={() => handleAnalyticsForClick(item)}
          key={item.url + idx}
          href={item.url}
        >
          {item.label}
        </FooterLink>
      ))}
    </Stack>
  );
};
