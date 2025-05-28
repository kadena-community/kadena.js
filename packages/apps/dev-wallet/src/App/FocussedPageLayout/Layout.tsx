import { PreviewBanner } from '@/Components/PreviewBanner/PreviewBanner';
import { MonoDarkMode, MonoLightMode } from '@kadena/kode-icons/system';
import { Button, Themes, useTheme } from '@kadena/kode-ui';
import {
  FocussedLayout,
  FocussedLayoutFooter,
  FocussedLayoutHeaderAside,
  FocussedLayoutLogo,
  FocussedLayoutProvider,
  FocussedLayoutTopBanner,
} from '@kadena/kode-ui/patterns';
import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

export const FocussedPageLayout: FC<PropsWithChildren> = ({ children }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  return (
    <FocussedLayoutProvider>
      <FocussedLayoutTopBanner>
        <PreviewBanner maxWidth={1000} />
      </FocussedLayoutTopBanner>
      <FocussedLayout
        logo={
          <a href="/">
            <FocussedLayoutLogo />
          </a>
        }
      >
        <FocussedLayoutHeaderAside>
          <Button
            isCompact
            variant="outlined"
            onPress={() => toggleTheme()}
            startVisual={
              theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />
            }
          />
        </FocussedLayoutHeaderAside>
        {children ? children : <Outlet />}
        <FocussedLayoutFooter />
      </FocussedLayout>
    </FocussedLayoutProvider>
  );
};
