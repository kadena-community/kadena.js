import { Divider } from '@kadena/react-components';

import { EditPage } from './components/EditPage';
import { Subscribe } from './components/Subscribe';
import { Wrapper } from './style';

import React, { FC } from 'react';

interface IProps {
  filenameForEdit?: string;
}

export const BottomPageSection: FC<IProps> = ({ filenameForEdit }) => {
  return (
    <>
      {Boolean(filenameForEdit) && <EditPage filename={filenameForEdit} />}

      <Divider />
      <Wrapper>
        <div />
        <Subscribe />
      </Wrapper>
    </>
  );
};
