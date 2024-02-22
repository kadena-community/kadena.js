import type { ITextFieldProps } from '@kadena/react-ui';
import { TextField as UITextField } from '@kadena/react-ui';
import classNames from 'classnames';
import { FC } from 'react';
import { textClass } from './style.css';

export const TextField: FC<ITextFieldProps> = ({ ...props }) => {
  return (
    <input {...props} className={classNames(textClass, props.className)} />
  );
};
