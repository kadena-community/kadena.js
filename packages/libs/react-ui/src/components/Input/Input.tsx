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

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC, InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import type { vars } from 'src/styles';

export interface IInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'children' | 'className' | 'id'
  > {
  leadingText?: string;
  leadingTextWidth?: keyof typeof vars.sizes;
  icon?: keyof typeof SystemIcon;
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
      icon,
      disabled = false,
      ...rest
    },
    ref,
  ) {
    const Icon = icon && SystemIcon[icon];

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
          {Icon && <Icon size="md" />}
          <input
            ref={ref}
            className={inputClass}
            disabled={disabled}
            {...rest}
          />
        </div>
      </div>
    );
  },
);
