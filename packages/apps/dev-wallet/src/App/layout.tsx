import { useNetwork } from '@/modules/network/network.hook';
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

export const Layout: FC = () => {
  const { networks, activeNetwork } = useNetwork();
  const [value, setValue] = useState(activeNetwork?.name);

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
          {networks.map((network) => (
            <SelectItem key={network.networkId} textValue={network.name}>
              {network.name}
            </SelectItem>
          ))}
        </NavHeaderSelect>
      </NavHeader>

      <Outlet />
      <div id="modalportal"></div>
    </>
  );
};
