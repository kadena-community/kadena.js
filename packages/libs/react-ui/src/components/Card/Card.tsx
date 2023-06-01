import {
  fullWidthVariant,
  stackVariant,
  StyledCardBody,
  StyledCardFooter,
} from './Card.css';

import React, { FC } from 'react';

export interface ICardChildComponentProps {
  children: React.ReactNode;
}

export const CardHeading: FC<ICardChildComponentProps> = ({
  children,
}: ICardChildComponentProps) => {
  // TODO: implement with heading tag
  return <h4>{children}</h4>;
};

export const CardBody: FC<ICardChildComponentProps> = ({ children }) => {
  return <div className={StyledCardBody}>{children}</div>;
};
export const CardFooter: FC<ICardChildComponentProps> = ({ children }) => {
  return <div className={StyledCardFooter}>{children}</div>;
};

export interface ICardProps {
  children: React.ReactNode;
  fullWidth?: keyof typeof fullWidthVariant;
  stack?: keyof typeof stackVariant;
}

export const Card: FC<ICardProps> = ({
  children,
  fullWidth = 'false',
  stack = 'false',
}) => {
  return (
    <div
      className={`
        ${fullWidthVariant[fullWidth]} 
        ${stackVariant[stack]} 
    `}
    >
      {children}
    </div>
  );
};
