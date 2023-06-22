import { SystemIcon } from '../../Icons';

import {
  containerClass,
  inputClass,
  inputContainerClass,
  leadingTextClass,
} from './InputField.css';

import React, { FC } from 'react';

export interface IInputFieldProps
  extends Omit<
    React.HTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'children' | 'className'
  > {
  as?: 'input';
  leadingText?: string;
  leftIcon?: typeof SystemIcon[keyof typeof SystemIcon];
  rightIcon?: typeof SystemIcon[keyof typeof SystemIcon];
  disabled?: boolean;
  type?: string;
}

export const InputField: FC<IInputFieldProps> = ({
  leadingText,
  leftIcon,
  rightIcon,
  disabled = false,
  ...rest
}) => {
  const RightIcon = rightIcon;
  const LeftIcon = leftIcon;

  return (
    <div className={containerClass}>
      {Boolean(leadingText) && (
        <span className={leadingTextClass}>{leadingText}</span>
      )}
      <div className={inputContainerClass}>
        {LeftIcon && <LeftIcon size="md" />}
        <input className={inputClass} disabled={disabled} {...rest} />
        {RightIcon && <RightIcon size="md" />}
      </div>
    </div>
  );
};
