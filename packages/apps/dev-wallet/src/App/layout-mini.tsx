import {
  defaultAccentColor,
  LayoutContext,
} from '@/modules/layout/layout.provider.tsx';
import { KadenaLogo, Stack, Text } from '@kadena/react-ui';
import { FC, useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { containerStyle, headerStyle, mainStyle } from './layout-mini.css';

export const LayoutMini: FC = () => {
  const { layoutContext } = useContext(LayoutContext) ?? [];
  const accentColor = layoutContext?.accentColor || defaultAccentColor;
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
        <Text>
          Go to{' '}
          <Link to="https://www.kadena.io/" target="_blank">
            kadena.io
          </Link>
        </Text>
      </Stack>
      <main
        className={mainStyle}
        style={{
          backgroundImage: `radial-gradient(circle farthest-side at 50% 170%, ${accentColor}, transparent 75%)`,
        }}
      >
        <div className={containerStyle}>
          <Outlet />
        </div>
      </main>
      <div id="modalportal"></div>
    </>
  );
};
