import { MonoDarkMode, MonoLightMode } from '@kadena/kode-icons/system';
import { Button, Themes, useTheme } from '@kadena/kode-ui';
import {
  FocussedLayout,
  FocussedLayoutFooter,
  FocussedLayoutHeaderAside,
  FocussedLayoutProvider,
} from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const LandingPageLayout: FC = () => {
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
        <Outlet />
        <FocussedLayoutFooter />
      </FocussedLayout>
    </FocussedLayoutProvider>
  );
};
