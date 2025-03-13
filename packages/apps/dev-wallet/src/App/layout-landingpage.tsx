import { MonoDarkMode, MonoLightMode } from '@kadena/kode-icons/system';
import { Button, Stack, Themes, useTheme } from '@kadena/kode-ui';
import {
  FocussedLayout,
  FocussedLayoutFooter,
  FocussedLayoutHeaderAside,
  FocussedLayoutProvider,
} from '@kadena/kode-ui/patterns';
import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { focussedLayoutChildrenWrapperClass } from './layout.css';

export const LandingPageLayout: FC<PropsWithChildren> = ({ children }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  return (
    <FocussedLayoutProvider>
      <FocussedLayout>
        <FocussedLayoutHeaderAside>
          <Button
            isCompact
            variant="transparent"
            onPress={() => toggleTheme()}
            startVisual={
              theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />
            }
          />
        </FocussedLayoutHeaderAside>
        <Stack className={focussedLayoutChildrenWrapperClass}>
          <Outlet />
          {children}
        </Stack>
        <FocussedLayoutFooter />
      </FocussedLayout>
    </FocussedLayoutProvider>
  );
};
