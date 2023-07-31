import { Divider, Stack } from '@kadena/react-ui';

import { EditPage } from './components/EditPage';
import { Subscribe } from './components/Subscribe';
import { BottomWrapper, Wrapper } from './style';

import { INavigation } from '@/types/Layout';
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
  return (
    <BottomWrapper layout={layout}>
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
