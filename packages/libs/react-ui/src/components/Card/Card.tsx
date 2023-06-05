import { fullWidthVariant, stackVariant } from './Card.css';

import React, { FC } from 'react';

export interface ICardChildComponentProps {
  children: React.ReactNode;
}

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
