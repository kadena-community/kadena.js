import {
  containerClass,
  containerClassDisabled,
  iconClass,
  selectClass,
  selectContainerClass,
  selectVariants,
} from './Select.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import React, { FC, forwardRef } from 'react';

export type SelectVariants = 'form' | 'flat';
export const variants: SelectVariants[] = ['form', 'flat'];

export interface ISelectProps
  extends Omit<
    React.HTMLAttributes<HTMLSelectElement>,
    'aria-label' | 'as' | 'className'
  > {
  children: React.ReactNode;
  icon?: (typeof SystemIcon)[keyof typeof SystemIcon];
  disabled?: boolean;
  value: string[] | string | number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  ref?: React.ForwardedRef<HTMLSelectElement>;
  ariaLabel: string;
  variant?: keyof typeof selectVariants;
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
    ariaLabel,
    variant = variants[0],
    ...rest
  },
  ref,
) {
  return (
    <div
      className={classNames(selectVariants[variant], containerClass, {
        [containerClassDisabled]: disabled,
      })}
      data-testid="kda-select"
    >
      <div className={selectContainerClass}>
        {Icon && (
          <span className={iconClass}>
            <Icon size="md" />
          </span>
        )}
        <select
          aria-label={ariaLabel}
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
