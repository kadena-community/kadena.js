import { Heading } from '@kadena/react-components';

import { StyledBackground, StyledHeader, SubHeader, Wrapper } from './style';

import React, { FC } from 'react';

interface IProps {
  title: string;
  subTitle?: string;
}

export const TitleHeader: FC<IProps> = ({ title, subTitle }) => {
  return (
    <StyledHeader>
      <StyledBackground />
      <Wrapper>
        <Heading as="h1">{title}</Heading>
        {subTitle !== undefined && (
          <SubHeader>
            <Heading as="h5" bold={false}>
              {subTitle}
            </Heading>
          </SubHeader>
        )}
      </Wrapper>
    </StyledHeader>
  );
};
