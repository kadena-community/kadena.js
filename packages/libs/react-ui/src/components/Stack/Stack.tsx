import {
  alignItemsClass,
  container,
  directionColumnClass,
  flexWrappedClass,
  justifyContentClass,
  spacingClass,
} from './Stack.css';

import className from 'classnames';
import React, { FC } from 'react';

export interface IStackProps {
  spacing?: keyof typeof spacingClass;
  direction?: boolean;
  flexWrap?: boolean;
  alignItems?: keyof typeof alignItemsClass;
  justifyContent?: keyof typeof justifyContentClass;
  children: React.ReactNode;
}

export const Stack: FC<IStackProps> = ({
  spacing = 'md',
  direction = false,
  flexWrap = false,
  alignItems = 'flex-start',
  justifyContent = 'flex-start',
  children,
}) => {
  const classList = className(
    container,
    spacingClass[spacing],
    alignItemsClass[alignItems],
    justifyContentClass[justifyContent],
    {
      [flexWrappedClass]: flexWrap,
      [directionColumnClass]: direction,
    },
  );
  return <div className={classList}>{children}</div>;
};
