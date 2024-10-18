import {
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
import type { FC } from 'react';
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
              <li className={sidebarMenuOptionClass}>
                <NavLink to="/" className={sidebarLinkClass}>
                  <Text>
                    <Stack alignItems="center" gap="md">
                      <MonoDataThresholding />
                      Dashboard
                    </Stack>
                  </Text>
                </NavLink>
              </li>
              <li className={sidebarMenuOptionClass}>
                <NavLink to="/sig-builder" className={sidebarLinkClass}>
                  <Text>
                    <Stack alignItems="center" gap="md">
                      <MonoSignature />
                      Sig Builder
                    </Stack>
                  </Text>
                </NavLink>
              </li>
              <li className={sidebarMenuOptionClass}>
                <NavLink to="/transfer" className={sidebarLinkClass}>
                  <Text>
                    <Stack alignItems="center" gap="md">
                      <MonoSwapHoriz />
                      Transfer
                    </Stack>
                  </Text>
                </NavLink>
              </li>
              <li className={sidebarMenuOptionClass}>
                <NavLink to="/transactions" className={sidebarLinkClass}>
                  <Text>
                    <Stack alignItems="center" gap="md">
                      <MonoTableRows />
                      Transactions
                    </Stack>
                  </Text>
                </NavLink>
              </li>
            </Stack>
            <Stack gap={'xxs'} flexDirection={'column'} marginBlockEnd={'n9'}>
              <Stack justifyContent={'center'} flexDirection={'column'}>
                <Heading variant="h5">Advanced Tools</Heading>
                <Divider variant="bold" />
              </Stack>
              <li className={sidebarMenuOptionClass}>
                <NavLink to="/networks" className={sidebarLinkClass}>
                  <Text>
                    <Stack alignItems="center" gap="md">
                      <MonoNetworkCheck />
                      Networks
                    </Stack>
                  </Text>
                </NavLink>
              </li>
              <li className={sidebarMenuOptionClass}>
                <NavLink
                  to="/backup-recovery-phrase/write-down"
                  className={sidebarLinkClass}
                >
                  <Text>
                    <Stack alignItems="center" gap="md">
                      <MonoTextSnippet />
                      Backup
                    </Stack>
                  </Text>
                </NavLink>
              </li>

              <li className={sidebarMenuOptionClass}>
                <NavLink to="/key-management/keys" className={sidebarLinkClass}>
                  <Text>
                    <Stack alignItems="center" gap="md">
                      <MonoKey />
                      Keys
                    </Stack>
                  </Text>
                </NavLink>
              </li>
              <li className={sidebarMenuOptionClass}>
                <NavLink to="/terminal" className={sidebarLinkClass}>
                  <Text>
                    <Stack alignItems="center" gap="md">
                      <MonoTerminal />
                      Dev Console
                    </Stack>
                  </Text>
                </NavLink>
              </li>
            </Stack>
          </ul>
        </Stack>
      </aside>
    </Box>
  );
};
