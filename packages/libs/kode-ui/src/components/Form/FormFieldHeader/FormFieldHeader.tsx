import { MonoErrorOutline } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { ComponentProps, FC, ReactNode } from 'react';
import React from 'react';
import {
  directionClass,
  directionInfoClass,
  disabledLabelClass,
  headerClass,
  infoClass,
  labelClass,
  tagClass,
} from './FormFieldHeader.css';
export type FormFieldDirection = NonNullable<keyof typeof directionInfoClass>;

export interface IFormFieldHeaderProps extends ComponentProps<'label'> {
  label: ReactNode;
  tag?: string;
  info?: string;
  className?: string;
  isDisabled?: boolean;
  direction?: FormFieldDirection;
}

export const FormFieldHeader: FC<IFormFieldHeaderProps> = ({
  label,
  tag,
  info,
  className,
  isDisabled,
  direction,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        headerClass,
        className,
        direction && directionClass[direction],
      )}
    >
      <label {...rest} className={isDisabled ? disabledLabelClass : labelClass}>
        {label}
      </label>
      {Boolean(tag) && <span className={tagClass}>{tag}</span>}
      {Boolean(info) && (
        <span
          className={classNames(
            infoClass,
            direction && directionInfoClass[direction],
          )}
        >
          {info}
          <MonoErrorOutline />
        </span>
      )}
    </div>
  );
};
