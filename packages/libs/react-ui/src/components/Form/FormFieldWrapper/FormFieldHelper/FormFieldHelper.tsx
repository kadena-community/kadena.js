import { SystemIcon } from '@components/Icon';
import type { FocusableElement } from '@react-types/shared';
import type { DOMAttributes, FC } from 'react';
import React from 'react';
import { helperClass, helperIconClass } from './FormFieldHelper.css';

interface IFormFieldHelperProps {
  children: React.ReactNode;
  helperTextProps?: DOMAttributes<FocusableElement>; // all props of the span
}

export const FormFieldHelper: FC<IFormFieldHelperProps> = ({ children }) => {
  return (
    <span className={helperClass}>
      <span className={helperIconClass}>
        <SystemIcon.AlertBox size="sm" />
      </span>
      {children}
    </span>
  );
};
