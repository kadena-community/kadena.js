import { Heading, ProductIcon, Stack } from '@kadena/react-ui';

import { HeaderWrapper, StyledHeader, SubHeader, Wrapper } from './style';

import { ProductIconNames } from '@/types/Layout';
import React, { FC } from 'react';

interface IProps {
  title: string;
  subTitle?: string;
  icon?: ProductIconNames;
}

export const TitleHeader: FC<IProps> = ({ title, subTitle, icon }) => {
  const Icon = icon ? ProductIcon[icon] : null;

  return (
    <HeaderWrapper data-cy="titleheader">
      <StyledHeader>
        <Wrapper>
          <Stack alignItems="center">
            {Icon && <Icon size="heroHeader" />}
            <Heading as="h1">{title}</Heading>
          </Stack>
          {subTitle !== undefined && (
            <SubHeader>
              <Heading as="h5" bold={false}>
                {subTitle}
              </Heading>
            </SubHeader>
          )}
        </Wrapper>
      </StyledHeader>
    </HeaderWrapper>
  );
};
