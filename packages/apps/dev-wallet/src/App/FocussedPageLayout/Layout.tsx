import { PreviewBanner } from '@/Components/PreviewBanner/PreviewBanner';
import { MonoDarkMode, MonoLightMode } from '@kadena/kode-icons/system';
import { Button, Stack, Themes, useTheme } from '@kadena/kode-ui';
import {
  FocussedLayout,
  FocussedLayoutFooter,
  FocussedLayoutHeaderAside,
  FocussedLayoutProvider,
  FocussedLayoutTopBanner,
} from '@kadena/kode-ui/patterns';
import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { focussedLayoutChildrenWrapperClass } from './../layout.css';
import { CardLayoutProvider } from './components/CardLayoutProvider';
import { InnerContent } from './components/InnerContent';

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
<<<<<<<< HEAD:packages/apps/dev-wallet/src/App/FocussedPageLayout/Layout.tsx
        {children ? children : <Outlet />}
========
        <CardLayoutProvider>
          <Stack className={focussedLayoutChildrenWrapperClass}>
            <InnerContent>
              <Outlet />
              {children}
            </InnerContent>
          </Stack>
        </CardLayoutProvider>
>>>>>>>> release/tools:packages/apps/dev-wallet/src/App/LayoutLandingPage/Layout.tsx
        <FocussedLayoutFooter />
      </FocussedLayout>
    </FocussedLayoutProvider>
  );
};
