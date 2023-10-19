import className from 'classnames';
import type { FC } from 'react';
import React from 'react';
import {
  containerClass,
  disabledClass,
  fullWidthClass,
  stackClass,
} from './Card.css';

export interface ICardProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  stack?: boolean;
  disabled?: boolean;
}

export const Card: FC<ICardProps> = (
  { children, fullWidth, stack, disabled },
) => {
  const classList = className(containerClass, {
    [stackClass]: stack,
    [fullWidthClass]: fullWidth,
    [disabledClass]: disabled,
  });

  // if disabled, also disable all the children
  if (disabled) {
    return (
      <div className={classList} data-testid="kda-card">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const filteredChild = { ...child, props: child.props };
            return React.cloneElement(filteredChild, { disabled: true });
          }
          return child;
        })}
      </div>
    );
  }

  return (
    <div className={classList} data-testid="kda-card">
      {children}
    </div>
  );
};
