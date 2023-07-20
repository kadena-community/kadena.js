import { IInputHeaderProps, InputHeader } from './InputHeader/InputHeader';
import { InputHelper } from './InputHelper/InputHelper';
import { Status, statusVariant } from './InputWrapper.css';

import { IInputProps } from '@components/Input';
import React, { FC, FunctionComponentElement } from 'react';

export interface IInputWrapperProps extends Omit<IInputHeaderProps, 'label'> {
  children:
    | FunctionComponentElement<IInputProps>
    | FunctionComponentElement<IInputProps>[];
  status?: Status;
  disabled?: boolean;
  helperText?: string;
  label?: string;
}

export const InputWrapper: FC<IInputWrapperProps> = ({
  status,
  disabled,
  children,
  label,
  htmlFor,
  tag,
  info,
  helperText,
}) => {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <div className={statusVal ? statusVariant[statusVal] : undefined}>
      {label !== undefined && (
        <InputHeader htmlFor={htmlFor} label={label} tag={tag} info={info} />
      )}
      <div className="inputGroup">{children}</div>
      {Boolean(helperText) && <InputHelper>{helperText}</InputHelper>}
    </div>
  );
};
