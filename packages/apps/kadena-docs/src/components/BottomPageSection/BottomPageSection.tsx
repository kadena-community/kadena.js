import { Divider } from '@kadena/react-components';

import { Subscribe } from './components/Subscribe';
import { Wrapper } from './style';

import React, { FC } from 'react';

export const BottomPageSection: FC = () => {
  return (
    <>
      <Divider />
      <Wrapper>
        <div />
        <Subscribe />
      </Wrapper>
    </>
  );
};
