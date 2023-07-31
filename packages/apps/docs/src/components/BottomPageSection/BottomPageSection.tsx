import { Divider, Stack } from '@kadena/react-ui';

import { EditPage } from './components/EditPage';
import { Subscribe } from './components/Subscribe';
import { BottomWrapper, Wrapper } from './style';

import { INavigation, LayoutType } from '@/types/Layout';
import { isOneOfLayoutType } from '@/utils';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  editLink?: string;
  navigation?: INavigation;
  layout?: LayoutType;
}

export const BottomPageSection: FC<IProps> = ({
  editLink,
  navigation,
  layout,
}) => {
  return (
    <BottomWrapper
      layout={
        isOneOfLayoutType(layout, 'redocly', 'code') ? 'redocly' : 'default'
      }
    >
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
      <Wrapper>
        <div />
        <Subscribe />
      </Wrapper>
    </BottomWrapper>
  );
};
