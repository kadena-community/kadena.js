import {
  MonoContacts,
  MonoDataThresholding,
  MonoKey,
  MonoNetworkCheck,
  MonoSignature,
  MonoSwapHoriz,
  MonoTableRows,
  MonoTerminal,
  MonoTextSnippet,
} from '@kadena/kode-icons';
import { Box, Divider, Heading, Stack, Text } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  fullHightClass,
  sidebarClass,
  sidebarLinkClass,
  sidebarMenuClass,
  sidebarMenuOptionClass,
} from './style.css.ts';

export const Sidebar: FC = () => {
  useParams();
  return (
    <Box paddingBlockStart="xxl" padding="xl" className={sidebarClass}>
      <aside className={fullHightClass}>
        <Stack marginBlockStart="md" height="100%">
          <ul className={sidebarMenuClass}>
            <Stack flexDirection={'column'} gap={'xxs'}>
              <SidebarItem route="/">
                <MonoDataThresholding />
                Dashboard
              </SidebarItem>
              <SidebarItem route="/sig-builder">
                <MonoSignature />
                Sig Builder
              </SidebarItem>
              <SidebarItem route="/transfer">
                <MonoSwapHoriz />
                Transfer
              </SidebarItem>
              <SidebarItem route="/transactions">
                <MonoTableRows />
                Transactions
              </SidebarItem>
              <SidebarItem route="/contacts">
                <MonoContacts />
                Contacts
              </SidebarItem>
            </Stack>
            <Stack gap={'xxs'} flexDirection={'column'} marginBlockEnd={'n9'}>
              <Stack justifyContent={'center'} flexDirection={'column'}>
                <Heading variant="h5">Advanced Tools</Heading>
                <Divider variant="bold" />
              </Stack>
              <SidebarItem route="/networks">
                <MonoNetworkCheck />
                Networks
              </SidebarItem>
              <SidebarItem route="/backup-recovery-phrase/write-down">
                <MonoTextSnippet />
                Backup
              </SidebarItem>
              <SidebarItem route="/key-management/keys">
                <MonoKey />
                Keys
              </SidebarItem>
              <SidebarItem route="/terminal">
                <MonoTerminal />
                Dev Console
              </SidebarItem>
            </Stack>
          </ul>
        </Stack>
      </aside>
    </Box>
  );
};

const SidebarItem: FC<PropsWithChildren<{ route: string }>> = ({
  children,
  route,
}) => (
  <li className={sidebarMenuOptionClass}>
    <NavLink to={route} className={sidebarLinkClass}>
      <Text>
        <Stack alignItems="center" gap="md">
          {children}
        </Stack>
      </Text>
    </NavLink>
  </li>
);
