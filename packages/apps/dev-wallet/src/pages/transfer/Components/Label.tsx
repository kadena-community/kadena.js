import { Text } from '@kadena/kode-ui';
import { labelClass } from './style.css';

export const Label = ({ children }: { children: React.ReactNode }) => (
  <Text size="small" className={labelClass}>
    {children}
  </Text>
);
