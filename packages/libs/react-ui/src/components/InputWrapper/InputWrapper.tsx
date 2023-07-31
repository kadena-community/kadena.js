import { IInputHeaderProps, InputHeader } from './InputHeader/InputHeader';
import { InputHelper } from './InputHelper/InputHelper';
import { Status, statusVariant } from './InputWrapper.css';

import { IInputProps } from '@components/Input';
import React, { FC, FunctionComponentElement } from 'react';
import { vars } from 'src/styles';

export interface IInputWrapperProps extends Omit<IInputHeaderProps, 'label'> {
  children:
    | FunctionComponentElement<IInputProps>
    | FunctionComponentElement<IInputProps>[];
  status?: Status;
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
  leadingTextWidth = '$32',
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
      <div className="inputGroup">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          const props = {
            ...child.props,
            leadingTextWidth,
          };

          return React.cloneElement(child, props);
        })}
      </div>
      {Boolean(helperText) && <InputHelper>{helperText}</InputHelper>}
    </div>
  );
};
