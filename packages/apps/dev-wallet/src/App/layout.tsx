import {
  KadenaLogo,
  NavHeader,
  NavHeaderLink,
  NavHeaderLinkList,
  NavHeaderSelect,
  SelectItem,
  SystemIcon,
} from '@kadena/react-ui';
import { FC, useState } from 'react';
import { Outlet } from 'react-router-dom';

const mockNetworkItems: string[] = ['DevNet', 'Testnet', 'Mainnet'];

export const Layout: FC = () => {
  const [value, setValue] = useState<string>(mockNetworkItems[0]);

  return (
    <>
      <NavHeader
        logo={
          <a href="">
            <KadenaLogo height={40} />
          </a>
        }
      >
        <NavHeaderLinkList>
          <NavHeaderLink key="home" href="/">
            DX-Wallet
          </NavHeaderLink>
          <NavHeaderLink key="home" href="/select-profile">
            Profiles
          </NavHeaderLink>
        </NavHeaderLinkList>

        <NavHeaderSelect
          aria-label="Select Network"
          selectedKey={value}
          onSelectionChange={(value: any) => setValue(value)}
          startIcon={<SystemIcon.Earth />}
        >
          {mockNetworkItems.map((network) => (
            <SelectItem key={network} textValue={network}>
              {network}
            </SelectItem>
          ))}
        </NavHeaderSelect>
      </NavHeader>

      <Outlet />
      <div id="modalportal"></div>
    </>
  );
};
