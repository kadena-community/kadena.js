import { useNetwork } from '@/modules/network/network.hook';
import {
  KadenaLogo,
  NavHeader,
  NavHeaderLinkList,
  NavHeaderSelect,
  SelectItem,
  SystemIcon,
  Text,
} from '@kadena/react-ui';
import { FC, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

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
          <Link to="/">
            <Text bold>DX-Wallet</Text>
          </Link>
          <Link to="/select-profile">
            <Text bold>Profiles</Text>
          </Link>
        </NavHeaderLinkList>

        <NavHeaderSelect
          aria-label="Select Network"
          selectedKey={value}
          onSelectionChange={(value) => setValue(value as string)}
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
