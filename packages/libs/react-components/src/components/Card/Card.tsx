import { Heading } from '../Typography';

import { StyledCard } from './styles';

import { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

export interface ICardProps {
  children: React.ReactNode;
  fullWidth?: VariantProps<typeof StyledCard>['fullWidth'];
  stack?: boolean;
}

export interface ICardHeadingProps {
  children: React.ReactNode;
}

export const CardHeading: FC<ICardHeadingProps> = ({
  children,
}: ICardHeadingProps) => {
  return <Heading as="h4">{children}</Heading>;
};

export const Card: FC<ICardProps> = ({ children, fullWidth, stack }) => {
  return (
    <StyledCard stack={stack} fullWidth={fullWidth}>
      {children}
    </StyledCard>
  );
};
