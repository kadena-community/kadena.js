import { useNetwork } from '@/modules/network/network.hook';
import { MonoPublic, MonoContrast } from '@kadena/react-icons';
import {
  KadenaLogo,
  NavHeader,
  NavHeaderLinkList,
  NavHeaderSelect,
  NavHeaderLink,
  NavHeaderButton,
  SelectItem,
} from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTheme } from 'next-themes';

export const Layout: FC = () => {
  const { networks, activeNetwork, setActiveNetwork } = useNetwork();

  const { systemTheme, theme, setTheme } = useTheme();

  const handleNetworkUpdate = (value: string) => {
    const network = networks.find((network) => network.networkId === value);
    if (network) {
      setActiveNetwork(network);
    }
  };

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const toggleTheme = (): void => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <>
      <NavHeader
        logo={
          <Link to="/">
            <KadenaLogo height={40} />
          </Link>
        }
      >
        <NavHeaderLinkList>
          <NavHeaderLink asChild>
            <Link to="/">DX Wallet</Link>
          </NavHeaderLink>
          <NavHeaderLink asChild>
            <Link to="/networks">Network</Link>
          </NavHeaderLink>
        </NavHeaderLinkList>

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

        <NavHeaderSelect
          aria-label="Select Network"
          selectedKey={activeNetwork?.networkId}
          onSelectionChange={(value) => handleNetworkUpdate(value as string)}
          startVisual={<MonoPublic />}
        >
          {networks.map((network) => (
            <SelectItem key={network.networkId} textValue={network.name}>
              {network.name}
            </SelectItem>
          ))}
        </NavHeaderSelect>
      </NavHeader>
      <main>
        <Outlet />
      </main>
      <div id="modalportal"></div>
    </>
  );
};
