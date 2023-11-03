import type { IInputProps } from '@components/Form';
import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import type { vars } from 'src/styles';
import type { FormFieldStatus } from '../Form.css';
import type { IInputHeaderProps } from './InputHeader/InputHeader';
import { InputHeader } from './InputHeader/InputHeader';
import { InputHelper } from './InputHelper/InputHelper';
import { InputWrapperContext } from './InputWrapper.context';
import { statusVariant } from './InputWrapper.css';

export interface IInputWrapperProps extends Omit<IInputHeaderProps, 'label'> {
  children:
    | FunctionComponentElement<IInputProps>
    | FunctionComponentElement<IInputProps>[];
  status?: FormFieldStatus;
  disabled?: boolean;
  helperText?: string;
  label?: string;
  leadingTextWidth?: keyof typeof vars.sizes;
}

export const InputWrapper: FC<IInputWrapperProps> = ({
  status,
  disabled,
  children,
  label,
  leadingTextWidth = undefined,
  htmlFor,
  tag,
  info,
  helperText,
}) => {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <InputWrapperContext.Provider value={{ status, leadingTextWidth }}>
      <div className={statusVal ? statusVariant[statusVal] : undefined}>
        {label !== undefined && (
          <InputHeader htmlFor={htmlFor} label={label} tag={tag} info={info} />
        )}
        <div className="inputGroup">{children}</div>
        {Boolean(helperText) && <InputHelper>{helperText}</InputHelper>}
      </div>
    </InputWrapperContext.Provider>
  );
};
