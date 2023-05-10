import { Heading } from '../Typography';

import { StyledCard } from './styles';

import { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

export interface ICardProps {
  children: React.ReactNode;
  color?: VariantProps<typeof StyledCard>['color'];
  expand?: boolean;
}

export interface ICardHeadingProps {
  children: React.ReactNode;
}

export const CardHeading: FC<ICardHeadingProps> = ({
  children,
}: ICardHeadingProps) => {
  return <Heading as="h4">{children}</Heading>;
};

export const Card: FC<ICardProps> = ({ children, expand, color }) => {
  return (
    <StyledCard color={color} expand={expand}>
      {children}
    </StyledCard>
  );
};
