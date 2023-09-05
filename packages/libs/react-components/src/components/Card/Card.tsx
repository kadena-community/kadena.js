/* eslint @kadena-dev/typedef-var: 0 */

import { Heading } from '../Typography';

import { StyledCard, StyledCardBody, StyledCardFooter } from './styles';

import type { VariantProps } from '@stitches/react';
import type { FC } from 'react';
import React from 'react';

export interface ICardProps {
  children: React.ReactNode;
  fullWidth?: VariantProps<typeof StyledCard>['fullWidth'];
  stack?: VariantProps<typeof StyledCard>['stack'];
}

export interface ICardHeadingProps {
  children: React.ReactNode;
}

const CardHeading: FC<ICardHeadingProps> = ({
  children,
}: ICardHeadingProps) => {
  return <Heading as="h4">{children}</Heading>;
};

const Container: FC<ICardProps> = ({ children, fullWidth, stack }) => {
  return (
    <StyledCard stack={stack} fullWidth={fullWidth}>
      {children}
    </StyledCard>
  );
};

export const Card = {
  Container,
  Heading: CardHeading,
  Body: StyledCardBody,
  Footer: StyledCardFooter,
};
