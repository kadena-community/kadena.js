import { env } from '@/utils/env';
import { NavHeader, KadenaLogo, NavHeaderLinkList, NavHeaderLink, Button, NavHeaderButton, Tooltip } from '@kadena/react-ui';
import { MonoAccountCircle } from '@kadena/react-icons';
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
        ? (
            <>
              <Tooltip delay={0} content={account.accountName} position="left">
                <a href={env.WALLET_URL} target="_blank"><NavHeaderButton endVisual={<MonoAccountCircle />}/></a>
              </Tooltip>
              <p>{account.alias}</p>
              <Button onClick={logout} variant="primary" isCompact={false}>Disconnect</Button>
            </>
          )
        : <Button onClick={login} variant="primary" isCompact={false}>Connect Wallet</Button>
      }
    </NavHeader>
  );
};
