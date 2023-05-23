import { Heading, ProductIcons, Stack } from '@kadena/react-components';

import { HeaderWrapper, StyledHeader, SubHeader, Wrapper } from './style';

import { ProductIconNames } from '@/types/Layout';
import React, { FC } from 'react';

interface IProps {
  title: string;
  subTitle?: string;
  icon: ProductIconNames;
}

export const TitleHeader: FC<IProps> = ({ title, subTitle, icon }) => {
  const Icon = ProductIcons[icon];
  return (
    <HeaderWrapper data-cy="titleheader">
      <StyledHeader>
        <Wrapper>
          <Stack alignItems="center">
            {Boolean(Icon) && <Icon size="lg" />}
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
