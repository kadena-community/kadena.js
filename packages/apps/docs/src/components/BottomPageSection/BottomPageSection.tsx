import type { INavigation } from '@/Layout';
import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { Divider, Grid, Stack } from '@kadena/react-ui';
import classnames from 'classnames';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { PageHelpful } from '../PageHelpful/PageHelpful';
import { EditPage } from './components/EditPage';
import { Subscribe } from './components/Subscribe';
import { bottomWrapperClass, bottomWrapperCodeLayoutClass } from './styles.css';

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
      <Grid.Root columns={{ sm: 1, lg: 3, xl: 4 }}>
        <Grid.Item columnSpan={1}>
          <EditPage editLink={editLink} />
        </Grid.Item>
        <Grid.Item columnSpan={{ sm: 1, lg: 2, xl: 3 }}>
          <Stack
            width={{ xs: '100%', lg: '100%' }}
            direction="row"
            justifyContent="space-between"
          >
            {navigation?.previous !== undefined && (
              <Link
                onClick={() =>
                  onClickAction('prev', navigation?.previous?.root)
                }
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
        </Grid.Item>
      </Grid.Root>

      <Divider />
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        width="100%"
        gap={{ xs: '$8', lg: '$2' }}
      >
        <PageHelpful editLink={editLink} />
        <Subscribe />
      </Stack>
    </footer>
  );
};
