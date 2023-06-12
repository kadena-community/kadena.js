import { Divider } from '@kadena/react-components';

import { EditPage } from './components/EditPage';
import { Subscribe } from './components/Subscribe';
import { Wrapper } from './style';

import React, { FC } from 'react';

interface IProps {
  editLink?: string;
}

export const BottomPageSection: FC<IProps> = ({ editLink }) => {
  return (
    <>
      <EditPage editLink={editLink} />
      <Divider />
      <Wrapper>
        <div />
        <Subscribe />
      </Wrapper>
    </>
  );
};
