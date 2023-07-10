import { SystemIcon } from '../Icons';

import {
  containerClass,
  containerClassDisabled,
  iconClass,
  selectClass,
  selectContainerClass,
} from './Select.css';

import classNames from 'classnames';
import React, { FC, forwardRef } from 'react';

export interface ISelectProps
  extends Omit<
    React.HTMLAttributes<HTMLSelectElement>,
    'as' | 'disabled' | 'children' | 'className' | 'onChange' | 'value'
  > {
  children: React.ReactNode;
  icon?: (typeof SystemIcon)[keyof typeof SystemIcon];
  disabled?: boolean;
  value: string[] | string | number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  ref?: React.ForwardedRef<HTMLSelectElement>;
}

export const Select: FC<ISelectProps> = forwardRef<
  HTMLSelectElement,
  ISelectProps
>(function Select(
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    icon: Icon,
    disabled = false,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      className={classNames(
        containerClass,
        disabled ? containerClassDisabled : '',
      )}
      data-testid="kda-select"
    >
      <div className={selectContainerClass}>
        {Icon && (
          <span className={iconClass}>
            <Icon size="md" />
          </span>
        )}
        <select
          ref={ref}
          className={selectClass}
          disabled={Boolean(disabled)}
          {...rest}
        >
          {children}
        </select>
      </div>
    </div>
  );
});
