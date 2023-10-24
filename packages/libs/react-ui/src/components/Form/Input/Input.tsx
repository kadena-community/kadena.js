import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC, InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import type { vars } from 'src/styles';
import { baseOutlinedClass } from '../Form.css';
import {
  containerClass,
  disabledClass,
  inputClass,
  inputContainerClass,
  leadingTextClass,
  leadingTextWidthVariant,
  leadingTextWrapperClass,
} from './Input.css';

export interface IInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'children' | 'className' | 'id'
  > {
  leadingText?: string;
  leadingTextWidth?: keyof typeof vars.sizes;
  icon?: keyof typeof SystemIcon;
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
      icon,
      rightIcon,
      disabled = false,
      ...rest
    },
    ref,
  ) {
    const RightIcon = rightIcon && SystemIcon[rightIcon];
    const Icon = icon && SystemIcon[icon];

    return (
      <div
        className={classNames(containerClass, {
          [baseOutlinedClass]: outlined,
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
            className={classNames(inputClass, {
              // [baseOutlinedClass]: outlined,
            })}
            disabled={disabled}
            {...rest}
          />
          {RightIcon && <RightIcon size="md" />}
        </div>
      </div>
    );
  },
);
