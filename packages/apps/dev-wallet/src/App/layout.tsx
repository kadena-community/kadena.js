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
import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';

export const Layout: FC = () => {
  const { networks, activeNetwork, setActiveNetwork } = useNetwork();

  const handleNetworkUpdate = (value: string) => {
    const network = networks.find((network) => network.networkId === value);
    if (network) {
      setActiveNetwork(network);
    }
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
          <Link to="/">
            <Text bold>DX-Wallet</Text>
          </Link>
          <Link to="/networks">
            <Text bold>Network</Text>
          </Link>
        </NavHeaderLinkList>

        <NavHeaderSelect
          aria-label="Select Network"
          selectedKey={activeNetwork?.networkId}
          onSelectionChange={(value) => handleNetworkUpdate(value as string)}
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
