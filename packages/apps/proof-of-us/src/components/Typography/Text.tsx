import type { ITextProps } from '@kadena/kode-ui';
import { Text as UIext } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { textClass } from './style.css';

export const Text: FC<ITextProps> = ({ children, ...props }) => {
  return (
    <UIext {...props} className={classNames(textClass, props.className)}>
      {children}
    </UIext>
  );
};
