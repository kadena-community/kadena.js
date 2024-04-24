import { MonoErrorOutline } from '@kadena/react-icons/system';
import classNames from 'classnames';
import type { ComponentProps, FC, ReactNode } from 'react';
import React from 'react';
import {
  headerClass,
  infoClass,
  labelClass,
  tagClass,
} from './FormFieldHeader.css';

export interface IFormFieldHeaderProps extends ComponentProps<'label'> {
  label: ReactNode;
  tag?: string;
  info?: string;
}

export const FormFieldHeader: FC<IFormFieldHeaderProps> = ({
  label,
  tag,
  info,
  className,
  ...rest
}) => {
  return (
    <div className={classNames(headerClass, className)}>
      <label {...rest} className={labelClass}>
        {label}
      </label>
      {Boolean(tag) && <span className={tagClass}>{tag}</span>}
      {Boolean(info) && (
        <span className={infoClass}>
          {info}
          <MonoErrorOutline />
        </span>
      )}
    </div>
  );
};
