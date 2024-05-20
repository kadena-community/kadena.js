import { NavHeader, KadenaLogo, NavHeaderLinkList, NavHeaderLink, Button } from '@kadena/react-ui';

export const MarketplaceHeader= () => {
  return (
    <NavHeader logo={<a href=""><KadenaLogo height={40} /></a>}>
      <NavHeaderLinkList>
        <NavHeaderLink
          href="/Marketplace"
          onClick={() => {}}
        >
          Marketplace
        </NavHeaderLink>
        <NavHeaderLink
          href="/Tokens"
          onClick={() => {}}
        >
          Tokens
        </NavHeaderLink>
        <NavHeaderLink
          href="/Transfer"
          onClick={() => {}}
        >
          Transfer
        </NavHeaderLink>
      </NavHeaderLinkList>
      <Button  variant="primary" isCompact={false} >Connect Wallet</Button>
    </NavHeader>
  );
};
