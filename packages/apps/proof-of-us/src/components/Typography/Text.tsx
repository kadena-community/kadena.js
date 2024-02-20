import type { ITextProps } from '@kadena/react-ui';
import { Text as UIext } from '@kadena/react-ui';
import type { FC } from 'react';
import { textClass } from './style.css';

export const Text: FC<ITextProps> = ({ children, ...props }) => {
  return (
    <UIext {...props} className={textClass}>
      {children}
    </UIext>
  );
};
