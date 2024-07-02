import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import type { INavigation } from '@kadena/docs-tools';
import { Divider, Grid, GridItem, Stack } from '@kadena/kode-ui';
import classnames from 'classnames';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { PageHelpful } from '../PageHelpful/PageHelpful';
import { EditPage } from './components/EditPage';
import { Subscribe } from './components/Subscribe';
import {
  bottomWrapperClass,
  bottomWrapperCodeLayoutClass,
  navClass,
} from './styles.css';

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
      <Grid columns={{ xs: 1, lg: 3, xl: 4 }}>
        <GridItem columnSpan={1}>
          <EditPage editLink={editLink} />
        </GridItem>
        <GridItem columnSpan={{ xs: 1, lg: 2, xl: 3 }}>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            className={navClass}
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
        </GridItem>
      </Grid>

      <Divider />
      <Stack
        flexDirection={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        width="100%"
        gap={{ xs: 'xl', lg: 'xs' }}
      >
        <PageHelpful editLink={editLink} />
        <Subscribe />
      </Stack>
    </footer>
  );
};
