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
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWalletState } from '../state/wallet';
import { stickyHeader } from './header.css';
import { KadenaLogo } from './KadenaLogo';
import Tooltip from './ToolTip';

export const Header: React.FC = () => {
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
      className={stickyHeader}
      logo={
        <Link to="/">
          <KadenaLogo height={40} />
        </Link>
      }
      activeHref={location.pathname}
    >
      <NavHeaderLinkList>
        <Tooltip text="View and manage your wallet accounts.">
          <NavHeaderLink href="/wallet" asChild>
            <Link to="/wallet">Wallet</Link>
          </NavHeaderLink>
        </Tooltip>
        <Tooltip text="View the list of recent transfers.">
          <NavHeaderLink href="/list" asChild>
            <Link to="/list">Transfers List</Link>
          </NavHeaderLink>
        </Tooltip>
        <Tooltip text="Make transactions by transfering funds from account to account.">
          <NavHeaderLink href="/transfer" asChild>
            <Link to="/transfer">Transfer Funds</Link>
          </NavHeaderLink>
        </Tooltip>
        <Tooltip text="Resolve human-readable names to addresses, or vice versa.">
          <NavHeaderLink href="/kadenanames" asChild>
            <Link to="/kadenanames">Kadena Names</Link>
          </NavHeaderLink>
        </Tooltip>
      </NavHeaderLinkList>

      <Tooltip text="Select the network for executing commands.">
        <NavHeaderSelect
          aria-label="Select Network"
          onSelectionChange={(key) => selectChainNetwork(key as string)}
          selectedKey={selectedNetwork}
          startVisual={<MonoUsb />}
        >
          <SelectItem key="mainnet01" textValue="Mainnet">
            Mainnet
          </SelectItem>
          <SelectItem key="testnet04" textValue="Testnet">
            Testnet
          </SelectItem>
          <SelectItem key="testnet05" textValue="Testnet Pact5">
            Testnet (Pact 5)
          </SelectItem>
        </NavHeaderSelect>
      </Tooltip>
      <Tooltip text="Switch between light and dark themes.">
        <NavHeaderButton
          endVisual={<MonoContrast />}
          onPress={toggleTheme}
          aria-label="Toggle Theme"
        />
      </Tooltip>
      <Tooltip text="Enable tutorial mode to see SDK calls in action.">
        <NavHeaderButton
          endVisual={debugMode === true ? <MonoCode /> : <MonoCodeOff />}
          onPress={toggleDebugMode}
          aria-label="Toggle Tutorial Mode"
        />
      </Tooltip>
    </NavHeader>
  );
};

export default Header;
