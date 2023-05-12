import { Heading, ProductIcons, Stack, Text } from '@kadena/react-components';

import { ItemStack, ItemSubHeader, StyledLink, StyledListItem } from './styles';

import { ProductIconNames } from '@/types/Layout';
import React, { FC } from 'react';

export interface ISection {
  title: string;
  subtitle: string;
  icon: ProductIconNames;
  href: string;
}

export const Section: FC<ISection> = ({ title, subtitle, icon, href }) => {
  const Icon = ProductIcons[icon];
  return (
    <StyledListItem>
      <StyledLink href={href}>
        <Icon />
        <ItemStack direction="column">
          <Heading as="h6">{title}</Heading>
          <ItemSubHeader color="emphasize">{subtitle}</ItemSubHeader>
        </ItemStack>
      </StyledLink>
    </StyledListItem>
  );
};
