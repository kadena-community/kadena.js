import { NavHeader, KadenaLogo, NavHeaderLinkList, NavHeaderLink, Button } from '@kadena/react-ui';
import { useAccount } from '@/hooks/account';

export const MarketplaceHeader= () => {
  const { account, isMounted, login, logout } = useAccount();

  return (
    <NavHeader logo={<a href="/"><KadenaLogo height={40} /></a>}>
      <NavHeaderLinkList>
        <NavHeaderLink
          href="/marketplace"
          onClick={() => {}}
        >
          Marketplace
        </NavHeaderLink>
        <NavHeaderLink
          href="/tokens"
          onClick={() => {}}
        >
          Tokens
        </NavHeaderLink>
        <NavHeaderLink
          href="/transfer"
          onClick={() => {}}
        >
          Transfer
        </NavHeaderLink>
      </NavHeaderLinkList>
      {account
        ? <Button onClick={logout} variant="primary" isCompact={false}>{account.alias}</Button>
        : <Button onClick={login} variant="primary" isCompact={false}>Connect Wallet</Button>
      }
    </NavHeader>
  );
};
