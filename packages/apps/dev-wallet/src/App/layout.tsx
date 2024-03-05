import {
  KadenaLogo,
  NavHeader,
  NavHeaderLink,
  NavHeaderLinkList,
  NavHeaderSelect,
  SelectItem,
  Stack,
  SystemIcon,
  Text,
} from '@kadena/react-ui';
import { FC, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { layout } from './layout.css';

const mockNetworkItems: string[] = ['DevNet', 'Testnet', 'Mainnet'];

export const Layout: FC = () => {
  const [value, setValue] = useState<string>(mockNetworkItems[0]);

  return (
    <div className={layout}>
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

      {/* <Stack
        as="nav"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding={'sm'}
        backgroundColor="base.default"
      >
        <Stack gap="sm" padding="sm">
          <Link to="/">
            <Text bold>DX-Wallet</Text>
          </Link>
        </Stack>
      </Stack> */}
      <Outlet />
      <div id="modalportal"></div>
    </div>
  );
};
