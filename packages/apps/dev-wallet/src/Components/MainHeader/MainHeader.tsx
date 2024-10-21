import { useWallet } from '@/modules/wallet/wallet.hook.tsx';
import { noStyleLinkClass } from '@/pages/home/style.css';
import { MonoContrast, MonoLogout, MonoPublic } from '@kadena/kode-icons';
import {
  KadenaLogo,
  NavHeader,
  NavHeaderButton,
  NavHeaderLink,
  NavHeaderLinkList,
  NavHeaderSelect,
  SelectItem,
  Stack,
  Text,
  Themes,
  useTheme,
} from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { headerStyle, selectNetworkClass } from './style.css';

export const MainHeader: FC = () => {
  const { networks, activeNetwork, setActiveNetwork } = useWallet();

  const { theme, setTheme } = useTheme();

  const handleNetworkUpdate = (uuid: string) => {
    const network = networks.find((network) => network.uuid === uuid);
    if (network && setActiveNetwork) {
      setActiveNetwork(network);
    }
  };

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  const { isUnlocked, lockProfile } = useWallet();

  const handleLogOut = () => {
    lockProfile();
  };

  return (
    <>
      <NavHeader
        logo={
          <Link to="/" className={noStyleLinkClass}>
            <Stack alignItems={'center'} gap={'md'}>
              <KadenaLogo height={40} />
              <Text>DX Wallet</Text>
            </Stack>
          </Link>
        }
        className={headerStyle}
      >
        <Stack flex={1} justifyContent={'flex-end'}>
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
            {!isUnlocked && (
              <NavHeaderLinkList>
                {[
                  <NavHeaderLink href="https://kadena.io">
                    Go to Kadena.io
                  </NavHeaderLink>,
                ]}
              </NavHeaderLinkList>
            )}
            {isUnlocked && (
              <>
                <NavHeaderSelect
                  aria-label="Select Network"
                  selectedKey={activeNetwork?.uuid}
                  onSelectionChange={(uuid) =>
                    handleNetworkUpdate(uuid as string)
                  }
                  startVisual={<MonoPublic />}
                  className={selectNetworkClass}
                >
                  {networks.map((network) => (
                    <SelectItem key={network.uuid} textValue={network.name}>
                      {network.name}
                    </SelectItem>
                  ))}
                </NavHeaderSelect>
                <NavHeaderButton
                  aria-label="Logout"
                  title="Logout"
                  onPress={() => handleLogOut()}
                >
                  <MonoLogout />
                </NavHeaderButton>
              </>
            )}
          </Stack>
        </Stack>
      </NavHeader>
    </>
  );
};
