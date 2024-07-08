import { Text } from '@kadena/kode-ui';
import { FC, PropsWithChildren } from 'react';
import { labelClass } from './style.css.ts';

export const Label: FC<PropsWithChildren> = ({ children }) => (
  <Text className={labelClass}>{children}</Text>
);

export const Value: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <Text bold variant="code" className={className}>
    {children}
  </Text>
);
