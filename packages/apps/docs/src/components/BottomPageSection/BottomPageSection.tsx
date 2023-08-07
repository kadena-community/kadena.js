import { Divider, Stack } from '@kadena/react-ui';

import { EditPage } from './components/EditPage';
import { Subscribe } from './components/Subscribe';
import { bottomWrapperClass, bottomWrapperCodeLayoutClass } from './styles.css';

import { INavigation } from '@/types/Layout';
import classnames from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';

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

  return (
    <div className={classes}>
      <Stack alignItems="center" justifyContent="space-between">
        <EditPage editLink={editLink} />
        {navigation?.previous !== undefined && (
          <Link href={navigation?.previous.root}>
            previous:
            <br />
            {navigation?.previous.title}
          </Link>
        )}
        {navigation?.next !== undefined && (
          <Link href={navigation?.next.root}>
            next:
            <br />
            {navigation?.next.title}
          </Link>
        )}
      </Stack>
      <Divider />
      <Stack justifyContent="flex-end" width="100%">
        <div />
        <Subscribe />
      </Stack>
    </div>
  );
};
