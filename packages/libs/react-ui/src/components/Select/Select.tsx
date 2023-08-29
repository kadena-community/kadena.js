import {
  containerClass,
  containerClassDisabled,
  iconClass,
  selectClass,
} from './Select.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import React, { FC, forwardRef } from 'react';

export interface ISelectProps
  extends Omit<
    React.HTMLAttributes<HTMLSelectElement>,
    'aria-label' | 'as' | 'className'
  > {
  ariaLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: (typeof SystemIcon)[keyof typeof SystemIcon];
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  ref?: React.ForwardedRef<HTMLSelectElement>;
  value: string[] | string | number;
}

export const Select: FC<ISelectProps> = forwardRef<
  HTMLSelectElement,
  ISelectProps
>(function Select(
  {
    ariaLabel,
    children,
    disabled = false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    icon: Icon,
    ...rest
  },
  ref,
) {
  return (
    <div
      className={classNames(containerClass, {
        [containerClassDisabled]: disabled,
      })}
      data-testid="kda-select"
    >
      {Icon && (
        <span className={iconClass}>
          <Icon size="md" />
        </span>
      )}
      <select
        aria-label={ariaLabel}
        className={selectClass}
        disabled={Boolean(disabled)}
        ref={ref}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
});
