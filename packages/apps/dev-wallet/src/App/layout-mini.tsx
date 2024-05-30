import { MonoContrast } from '@kadena/react-icons/system';
import {
  KadenaLogo,
  NavHeaderButton,
  Stack,
  Text,
  Themes,
  useTheme,
} from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { containerStyle, headerStyle, mainStyle } from './layout-mini.css';

export const LayoutMini: FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

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
        <NavHeaderButton
          aria-label="Toggle theme"
          onPress={() => toggleTheme()}
          className={atoms({ marginInlineEnd: 'sm' })}
        >
          <MonoContrast
            className={atoms({
              color: 'text.base.default',
            })}
          />
        </NavHeaderButton>
        <Text>
          Go to{' '}
          <Link to="https://www.kadena.io/" target="_blank">
            kadena.io
          </Link>
        </Text>
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
