import { Stack, Text } from '@kadena/react-ui';
import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { layout } from './layout.css';

export const Layout: FC = () => {
  return (
    <div className={layout}>
      <Stack
        as="nav"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding={'sm'}
        backgroundColor="base.default"
      >
        <Stack gap="sm" padding="sm">
          <Link to="/">
            <Text bold>DX-Wallet</Text>
          </Link>
        </Stack>
      </Stack>
      <Outlet />
      <div id="modalportal"></div>
    </div>
  );
};
