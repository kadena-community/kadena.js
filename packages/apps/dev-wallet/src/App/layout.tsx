import {
  backgroundStyle,
  headerStyle,
  mainColumnStyle,
  selectNetworkClass,
} from '@/App/layout.css.ts';
import { Sidebar } from '@/Components/Sidebar/Sidebar.tsx';
import { LayoutContext } from '@/modules/layout/layout.provider.tsx';
import { useNetwork } from '@/modules/network/network.hook';
import { useWallet } from '@/modules/wallet/wallet.hook.tsx';
import { pageClass } from '@/pages/home/style.css.ts';
import { MonoContrast, MonoLogout, MonoPublic } from '@kadena/react-icons';
import {
  Box,
  KadenaLogo,
  NavHeader,
  NavHeaderButton,
  NavHeaderLink,
  NavHeaderLinkList,
  NavHeaderSelect,
  SelectItem,
  Stack,
  Themes,
  useTheme,
} from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import { FC, useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';

export const Layout: FC = () => {
  const { networks, activeNetwork, setActiveNetwork } = useNetwork();

  const { theme, setTheme } = useTheme();

  const handleNetworkUpdate = (value: string) => {
    const network = networks.find((network) => network.networkId === value);
    if (network) {
      setActiveNetwork(network);
    }
  };

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  const { isUnlocked, lockProfile } = useWallet();

  const { layoutContext } = useContext(LayoutContext) ?? [];
  const accentColor = layoutContext?.accentColor;
  const handleLogOut = () => {
    lockProfile();
  };

  return (
    <>
      <NavHeader
        logo={
          <Link to="/">
            <KadenaLogo height={40} />
          </Link>
        }
        className={headerStyle}
      >
        <NavHeaderLinkList>
          <NavHeaderLink asChild>
            <Link to="/">DX Wallet</Link>
          </NavHeaderLink>
          <NavHeaderLink asChild>
            <Link to="/networks">Network</Link>
          </NavHeaderLink>
        </NavHeaderLinkList>

        <Stack alignItems="center">
          <NavHeaderButton
            aria-label="Toggle theme"
            title="Toggle theme"
            onPress={() => toggleTheme()}
            className={atoms({ marginInlineEnd: 'sm' })}
          >
            <MonoContrast
              className={atoms({
                color: 'text.base.default',
              })}
            />
          </NavHeaderButton>
          <NavHeaderSelect
            aria-label="Select Network"
            selectedKey={activeNetwork?.networkId}
            onSelectionChange={(value) => handleNetworkUpdate(value as string)}
            startVisual={<MonoPublic />}
            className={selectNetworkClass}
          >
            {networks.map((network) => (
              <SelectItem key={network.networkId} textValue={network.name}>
                {network.name}
              </SelectItem>
            ))}
          </NavHeaderSelect>
          {isUnlocked && (
            <NavHeaderButton
              aria-label="Logout"
              title="Logout"
              onPress={() => handleLogOut()}
            >
              <MonoLogout />
            </NavHeaderButton>
          )}
        </Stack>
      </NavHeader>
      <main>
        <Stack
          className={pageClass}
          style={{
            backgroundImage: `radial-gradient(circle farthest-side at 50% 170%, ${accentColor}, transparent 75%)`,
          }}
        >
          <Sidebar></Sidebar>
          <Box padding="n10" className={mainColumnStyle}>
            <div className={backgroundStyle}></div>
            <Outlet />
          </Box>
        </Stack>
      </main>
      <div id="modalportal"></div>
    </>
  );
};
