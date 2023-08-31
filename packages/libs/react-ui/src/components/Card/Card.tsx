import {
  container,
  disabledClass,
  fullWidthClass,
  stackClass,
} from './Card.css';

import className from 'classnames';
import React, { type FC } from 'react';

export interface ICardChildComponentProps {
  children: React.ReactNode;
}

export interface ICardProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  stack?: boolean;
  disabled?: boolean;
}

export const Card: FC<ICardProps> = ({
  children,
  fullWidth,
  stack,
  disabled,
}) => {
  const classList = className(container, {
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
