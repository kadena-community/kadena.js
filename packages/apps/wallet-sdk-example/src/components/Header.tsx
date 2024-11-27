import {
  MonoCode,
  MonoCodeOff,
  MonoContrast,
  MonoUsb,
} from '@kadena/kode-icons';
import {
  NavHeader,
  NavHeaderButton,
  NavHeaderLink,
  NavHeaderLinkList,
  NavHeaderSelect,
  SelectItem,
} from '@kadena/kode-ui';
import { useTheme } from 'next-themes';
import { Link, useLocation } from 'react-router-dom';
import { useWalletState } from '../state/wallet';
import { KadenaLogo } from './KadenaLogo';

export const Header = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { selectNetwork, selectedNetwork, debugMode, setDebugMode } =
    useWalletState();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  const selectChainNetwork = (network: string) => {
    selectNetwork(network);
  };

  return (
    <NavHeader
      logo={
        <Link to="/">
          <KadenaLogo height={40} />
        </Link>
      }
      activeHref={location.pathname}
    >
      <NavHeaderLinkList>
        <NavHeaderLink href="/wallet" asChild>
          <Link to="/wallet">Wallet</Link>
        </NavHeaderLink>
        <NavHeaderLink href="/list" asChild>
          <Link to="/list">Transfers List</Link>
        </NavHeaderLink>
        <NavHeaderLink href="/transfer" asChild>
          <Link to="/transfer">Transfer Funds</Link>
        </NavHeaderLink>
        <NavHeaderLink href="/kadenanames" asChild>
          <Link to="/kadenanames">Kadena Names</Link>
        </NavHeaderLink>
      </NavHeaderLinkList>
      <NavHeaderSelect
        aria-label="Select Network"
        onSelectionChange={(key) => selectChainNetwork(key as string)}
        selectedKey={selectedNetwork}
        startVisual={<MonoUsb />}
      >
        <SelectItem key={'mainnet01'} textValue="Mainnet">
          Mainnet
        </SelectItem>
        <SelectItem key={'testnet04'} textValue="Testnet">
          Testnet
        </SelectItem>
        <SelectItem key={'testnet05'} textValue="Testnet Pact5">
          Testnet (Pact 5)
        </SelectItem>
      </NavHeaderSelect>
      <NavHeaderButton
        endVisual={<MonoContrast />}
        onPress={toggleTheme}
        aria-label="Toggle Theme"
      />
      <NavHeaderButton
        endVisual={debugMode === true ? <MonoCode /> : <MonoCodeOff />}
        onPress={toggleDebugMode}
        aria-label="Toggle Theme"
      />
    </NavHeader>
  );
};

export default Header;
