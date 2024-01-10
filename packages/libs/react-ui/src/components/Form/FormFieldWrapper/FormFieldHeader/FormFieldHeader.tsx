import type { FC, ReactNode } from 'react';
import React from 'react';
import { SystemIcon } from '../../../Icon';
import { AlertCircleOutline } from '../../../Icon/System/SystemIcon';
import { Label } from '../../../Typography/Label/Label';
import { headerClass, infoClass, tagClass } from './FormFieldHeader.css';

export interface IFormFieldHeaderProps {
  htmlFor: string;
  label: ReactNode;
  tag?: string;
  info?: string;
}

export const FormFieldHeader: FC<IFormFieldHeaderProps> = ({
  label,
  htmlFor,
  tag,
  info,
}) => {
  return (
    <div className={headerClass}>
      {Boolean(label) && <Label htmlFor={htmlFor}>{label}</Label>}
      {Boolean(tag) && <span className={tagClass}>{tag}</span>}
      {Boolean(info) && (
        <span className={infoClass}>
          {info}
          <AlertCircleOutline size="sm" />
        </span>
      )}
    </div>
  );
};
