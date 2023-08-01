import {
  containerClass,
  inputClass,
  inputContainerClass,
  leadingTextClass,
  leadingTextWidthVariant,
  leadingTextWrapperClass,
  outlinedClass,
} from './Input.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import React, { FC, forwardRef, InputHTMLAttributes } from 'react';
import { vars } from 'src/styles';

export interface IInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'children' | 'className' | 'id'
  > {
  leadingText?: string;
  leadingTextWidth?: keyof typeof vars.sizes;
  leftIcon?: (typeof SystemIcon)[keyof typeof SystemIcon];
  rightIcon?: (typeof SystemIcon)[keyof typeof SystemIcon];
  disabled?: boolean;
  type?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
  id: string;
  outlined?: boolean;
}

export const Input: FC<IInputProps> = forwardRef<HTMLInputElement, IInputProps>(
  function Input(
    {
      outlined,
      leadingText,
      leadingTextWidth,
      leftIcon,
      rightIcon,
      disabled = false,
      ...rest
    },
    ref,
  ) {
    const RightIcon = rightIcon;
    const LeftIcon = leftIcon;

    return (
      <div
        className={classNames(containerClass, { [outlinedClass]: outlined })}
        data-testid="kda-input"
      >
        {Boolean(leadingText) && (
          <div className={leadingTextWrapperClass}>
            <span
              className={classNames(
                leadingTextClass,
                leadingTextWidth && leadingTextWidthVariant[leadingTextWidth],
              )}
            >
              {leadingText}
            </span>
          </div>
        )}
        <div className={inputContainerClass}>
          {LeftIcon && <LeftIcon size="md" />}
          <input
            ref={ref}
            className={inputClass}
            disabled={disabled}
            {...rest}
          />
          {RightIcon && <RightIcon size="md" />}
        </div>
      </div>
    );
  },
);
