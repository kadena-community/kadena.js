import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC, InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import type { vars } from 'src/styles';
import {
  containerClass,
  disabledClass,
  inputClass,
  inputContainerClass,
  leadingTextClass,
  leadingTextWidthVariant,
  leadingTextWrapperClass,
  outlinedClass,
} from './Input.css';

export interface IInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'children' | 'className' | 'id'
  > {
  leadingText?: string;
  leadingTextWidth?: keyof typeof vars.sizes;
  leftIcon?: keyof typeof SystemIcon;
  rightIcon?: keyof typeof SystemIcon;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
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
    const RightIcon = rightIcon && SystemIcon[rightIcon];
    const LeftIcon = leftIcon && SystemIcon[leftIcon];

    return (
      <div
        className={classNames(containerClass, {
          [outlinedClass]: outlined,
          [disabledClass]: disabled,
        })}
        data-testid="kda-input"
      >
        {Boolean(leadingText) && (
          <div
            className={classNames(
              leadingTextWrapperClass,
              leadingTextWidth && leadingTextWidthVariant[leadingTextWidth],
            )}
          >
            <span className={leadingTextClass}>{leadingText}</span>
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
