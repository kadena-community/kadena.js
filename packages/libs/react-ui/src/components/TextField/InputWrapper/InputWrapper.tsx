import { IInputHeaderProps, InputHeader } from './InputHeader/InputHeader';
import { InputHelper } from './InputHelper/InputHelper';
import { Status, statusVariant } from './InputWrapper.css';

import React, { FC } from 'react';

export interface IInputWrapperProps extends IInputHeaderProps {
  children: React.ReactNode;
  status?: Status;
  disabled?: boolean;
  helperText?: string;
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
      <InputHeader htmlFor={htmlFor} label={label} tag={tag} info={info} />
      {children}
      {Boolean(helperText) && <InputHelper>{helperText}</InputHelper>}
    </div>
  );
};
