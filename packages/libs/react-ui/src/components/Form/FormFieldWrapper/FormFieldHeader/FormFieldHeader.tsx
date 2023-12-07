import { SystemIcon } from '@components/Icon';
import type { DOMAttributes, FC, LabelHTMLAttributes } from 'react';
import React from 'react';
import {
  headerClass,
  infoClass,
  labelClass,
  tagClass,
} from './FormFieldHeader.css';

export interface IFormFieldHeaderProps {
  label: string;
  htmlFor: string;
  tag?: string;
  info?: string;
  labelProps?:
    | DOMAttributes<HTMLLabelElement>
    | LabelHTMLAttributes<HTMLLabelElement>;
}

export const FormFieldHeader: FC<IFormFieldHeaderProps> = ({
  label,
  htmlFor,
  labelProps,
  tag,
  info,
}) => {
  return (
    <div className={headerClass}>
      {Boolean(label) && (
        <label className={labelClass} htmlFor={htmlFor} {...labelProps}>
          {label}
        </label>
      )}
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
