import { Hr } from '@kadena/react-components';

import { Subscribe } from './components/Subscribe';
import { Wrapper } from './style';

import React, { FC } from 'react';

export const BottomPageSection: FC = () => {
  return (
    <>
      <Hr />
      <Wrapper>
        <div />
        <Subscribe />
      </Wrapper>
    </>
  );
};
