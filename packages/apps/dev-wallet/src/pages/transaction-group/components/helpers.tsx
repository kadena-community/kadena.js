import { Text } from '@kadena/kode-ui';
import { FC, PropsWithChildren } from 'react';
import { labelBoldClass, labelClass } from './style.css.ts';

export const Label: FC<
  PropsWithChildren<{
    bold?: boolean;
    size?: 'small' | 'smallest' | 'base' | 'inherit';
  }>
> = ({ children, bold, size }) => (
  <Text size={size} className={bold ? labelBoldClass : labelClass}>
    {children}
  </Text>
);

export const Value: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <Text size="smallest" bold variant="code" className={className}>
    {children}
  </Text>
);
