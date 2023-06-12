import { Divider, Stack } from '@kadena/react-components';

import { EditPage } from './components/EditPage';
import { Subscribe } from './components/Subscribe';
import { Wrapper } from './style';

import { INavigation } from '@/types/Layout';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  editLink?: string;
  navigation?: INavigation;
}

export const BottomPageSection: FC<IProps> = ({ editLink, navigation }) => {
  return (
    <>
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
    </>
  );
};
