import { Text } from '@kadena/kode-ui';
import { FC, PropsWithChildren } from 'react';
import { labelBoldClass, labelClass } from './style.css.ts';

export const Label: FC<PropsWithChildren<{ bold?: boolean }>> = ({
  children,
  bold,
}) => <Text className={bold ? labelBoldClass : labelClass}>{children}</Text>;

export const Value: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <Text size="smallest" bold variant="code" className={className}>
    {children}
  </Text>
);
