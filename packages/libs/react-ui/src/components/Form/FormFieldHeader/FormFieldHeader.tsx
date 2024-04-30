import { MonoErrorOutline } from '@kadena/react-icons/system';
import classNames from 'classnames';
import type { ComponentProps, FC, ReactNode } from 'react';
import React from 'react';
import {
  disabledLabelClass,
  headerClass,
  infoClass,
  labelClass,
  tagClass,
} from './FormFieldHeader.css';

export interface IFormFieldHeaderProps extends ComponentProps<'label'> {
  label: ReactNode;
  tag?: string;
  info?: string;
  className?: string;
  isDisabled?: boolean;
}

export const FormFieldHeader: FC<IFormFieldHeaderProps> = ({
  label,
  tag,
  info,
  className,
  isDisabled,
  ...rest
}) => {
  return (
    <div className={classNames(headerClass, className)}>
      <label {...rest} className={isDisabled ? disabledLabelClass : labelClass}>
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
