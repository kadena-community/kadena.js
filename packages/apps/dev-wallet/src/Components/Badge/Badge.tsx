import { MonoAutoAwesome, MonoLink } from '@kadena/kode-icons/system';
import { Stack } from '@kadena/kode-ui';
import { FC, PropsWithChildren } from 'react';
import { chainClass } from './style.css';

export const Badge: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack
      alignItems={'center'}
      className={chainClass}
      paddingInlineStart={'xs'}
      paddingInlineEnd={'xs'}
      borderRadius="sm"
      gap={'xxs'}
    >
      {children}
    </Stack>
  );
};

export const Chain: FC<{ chainId: string }> = ({ chainId }) => (
  <Badge>
    <MonoLink /> {chainId}
  </Badge>
);

export const AutoBadge: FC = () => (
  <Badge>
    <MonoAutoAwesome /> Auto
  </Badge>
);
