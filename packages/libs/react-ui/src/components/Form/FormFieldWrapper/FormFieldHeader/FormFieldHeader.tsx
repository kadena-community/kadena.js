import type { FC } from 'react';
import React from 'react';
import { SystemIcon } from '../../../Icon';
import { Label } from '../../../Typography/Label/Label';
import { headerClass, infoClass, tagClass } from './FormFieldHeader.css';

export interface IFormFieldHeaderProps {
  label: string;
  htmlFor: string;
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
          <SystemIcon.AlertCircleOutline size="sm" />
        </span>
      )}
    </div>
  );
};
