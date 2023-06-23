import { SystemIcon } from '../../Icons';

import {
  containerClass,
  inputClass,
  inputContainerClass,
  leadingTextClass,
} from './Input.css';

import React, { FC, forwardRef } from 'react';

export interface IInputProps
  extends Omit<
    React.HTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'children' | 'className' | 'id'
  > {
  leadingText?: string;
  leftIcon?: typeof SystemIcon[keyof typeof SystemIcon];
  rightIcon?: typeof SystemIcon[keyof typeof SystemIcon];
  disabled?: boolean;
  type?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
  id: string;
}

export const Input: FC<IInputProps> = forwardRef<HTMLInputElement, IInputProps>(
  function Input(
    { leadingText, leftIcon, rightIcon, disabled = false, ...rest },
    ref,
  ) {
    const RightIcon = rightIcon;
    const LeftIcon = leftIcon;

    return (
      <div className={containerClass}>
        {Boolean(leadingText) && (
          <span className={leadingTextClass}>{leadingText}</span>
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
