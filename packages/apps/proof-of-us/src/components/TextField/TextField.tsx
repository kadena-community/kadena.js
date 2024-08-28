import type { ITextFieldProps } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { textClass } from './style.css';

export const TextField: FC<Omit<ITextFieldProps, 'size'>> = ({ ...props }) => {
  return (
    <input {...props} className={classNames(textClass, props.className)} />
  );
};
