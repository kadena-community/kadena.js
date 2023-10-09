import { Divider, Stack } from '@kadena/react-ui';

import { PageHelpful } from '../PageHelpful/PageHelpful';

import { EditPage } from './components/EditPage';
import { Subscribe } from './components/Subscribe';
import { bottomWrapperClass, bottomWrapperCodeLayoutClass } from './styles.css';

import type { INavigation } from '@/Layout';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import classnames from 'classnames';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  editLink?: string;
  navigation?: INavigation;
  layout?: 'default' | 'code';
}

export const BottomPageSection: FC<IProps> = ({
  editLink,
  navigation,
  layout = 'default',
}) => {
  const classes = classnames(bottomWrapperClass, {
    [bottomWrapperCodeLayoutClass]: layout === 'code',
  });

  const onClickAction = (page: 'prev' | 'next', href?: string): void => {
    if (!href) return;

    analyticsEvent(
      page === 'next'
        ? EVENT_NAMES['click:next_page']
        : EVENT_NAMES['click:previous_page'],
      {
        to: href,
        from: window.location.pathname,
      },
    );
  };

  return (
    <footer className={classes}>
      <Stack alignItems="center" justifyContent="space-between">
        <EditPage editLink={editLink} />
        {navigation?.previous !== undefined && (
          <Link
            onClick={() => onClickAction('prev', navigation?.previous?.root)}
            href={navigation?.previous.root}
          >
            previous:
            <br />
            {navigation?.previous.title}
          </Link>
        )}
        {navigation?.next !== undefined && (
          <Link
            onClick={() => onClickAction('next', navigation?.next?.root)}
            href={navigation?.next.root}
          >
            next:
            <br />
            {navigation?.next.title}
          </Link>
        )}
      </Stack>
      <Divider />
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        width="100%"
      >
        <PageHelpful editLink={editLink} />
        <Subscribe />
      </Stack>
    </footer>
  );
};
