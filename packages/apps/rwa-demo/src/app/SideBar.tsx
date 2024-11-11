import { MonoApps, MonoDarkMode, MonoLightMode } from '@kadena/kode-icons';
import { Button, Themes, useTheme } from '@kadena/kode-ui';
import {
  SideBarItem,
  SideBarItemsInline,
  SideBar as SideBarLayout,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import type { FC } from 'react';
import { KLogo } from './KLogo';

export const SideBar: FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };
  return (
    <SideBarLayout
      logo={
        <>
          <Link href="/">
            <KLogo height={40} />
          </Link>
        </>
      }
      navigation={
        <>
          <SideBarItem
            visual={<MonoApps />}
            label="Dashboard"
            component={Link}
            href="/"
          />
        </>
      }
      context={
        <>
          <SideBarItemsInline>
            <SideBarItem
              visual={theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />}
              onPress={toggleTheme}
              label="Change theme"
            >
              <Button
                isCompact
                variant="transparent"
                onPress={() => toggleTheme()}
                startVisual={
                  theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />
                }
              />
            </SideBarItem>
          </SideBarItemsInline>
        </>
      }
    ></SideBarLayout>
  );
};
