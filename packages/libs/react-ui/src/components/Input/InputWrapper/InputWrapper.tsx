import { statusVariant } from './InputWrapper.css';

import React, { FC } from 'react';

export interface IInputWrapperProps {
  children: React.ReactNode;
  status?: 'success' | 'error';
  disabled?: boolean;
}

export const InputWrapper: FC<IInputWrapperProps> = ({
  status,
  disabled,
  children,
}) => {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <div className={statusVal ? statusVariant[statusVal] : undefined}>
      {children}
    </div>
  );
};
