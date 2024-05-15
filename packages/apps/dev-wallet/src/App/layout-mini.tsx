import {
  KadenaLogo,
  Stack,
  Text,
} from '@kadena/react-ui';
import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { headerStyle, mainStyle, containerStyle } from './layout-mini.css';

export const LayoutMini: FC = () => {
  return (
    <>
      <Stack
        as="header"
        alignItems="center"
        flexDirection="row"
        gap="md"
        justifyContent="space-between"
        padding="lg"
        className={headerStyle}
      >
        <Link to="/">
          <KadenaLogo height={40} />
        </Link>
        <Text>Go to <Link to="https://www.kadena.io/" target="_blank">kadena.io</Link></Text>
      </Stack>
      <main className={mainStyle}>
        <div className={containerStyle}>
          <Outlet />
        </div>
      </main>
      <div id="modalportal"></div>
    </>
  );
};
