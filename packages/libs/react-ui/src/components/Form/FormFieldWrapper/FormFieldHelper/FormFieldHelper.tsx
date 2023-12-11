import { SystemIcon } from '@components/Icon';
import { FocusableElement } from '@react-types/shared';
import type { DOMAttributes, FC } from 'react';
import React from 'react';
import { helperClass, helperIconClass } from './FormFieldHelper.css';

interface IFormFieldHelperProps {
  children: React.ReactNode;
  descriptionProps?: DOMAttributes<FocusableElement>;
}

export const FormFieldHelper: FC<IFormFieldHelperProps> = ({
  children,
  descriptionProps,
}) => {
  return (
    <span {...descriptionProps} className={helperClass}>
      <span className={helperIconClass}>
        <SystemIcon.AlertBox size="sm" />
      </span>
      {children}
    </span>
  );
};
