import {
  alignItemsClass,
  container,
  directionClass,
  flexWrapClass,
  justifyContentClass,
  spacingClass,
} from './Stack.css';

import className from 'classnames';
import React, { FC } from 'react';

export interface IStackProps {
  spacing?: keyof typeof spacingClass;
  direction?: keyof typeof directionClass;
  flexWrap?: keyof typeof flexWrapClass;
  alignItems?: keyof typeof alignItemsClass;
  justifyContent?: keyof typeof justifyContentClass;
  children: React.ReactNode;
}

export const Stack: FC<IStackProps> = ({
  spacing = 'md',
  direction = 'row',
  flexWrap = 'nowrap',
  alignItems = 'flex-start',
  justifyContent = 'flex-start',
  children,
}) => {
  const classList = className(
    container,
    spacingClass[spacing],
    alignItemsClass[alignItems],
    justifyContentClass[justifyContent],
    flexWrapClass[flexWrap],
    directionClass[direction],
  );
  return <div className={classList}>{children}</div>;
};
