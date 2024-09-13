import {
  MonoDataThresholding,
  MonoKey,
  MonoSignature,
  MonoSwapHoriz,
  MonoTableRows,
} from '@kadena/kode-icons';
import { Box, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  sidebarClass,
  sidebarLinkClass,
  sidebarMenuClass,
  sidebarMenuOptionClass,
} from './style.css.ts';

export const Sidebar: FC = () => {
  useParams();
  return (
    <Box paddingBlockStart="xxl" padding="xl" className={sidebarClass}>
      <aside>
        <Box marginBlockStart="md">
          <ul className={sidebarMenuClass}>
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
              <NavLink to="/key-sources" className={sidebarLinkClass}>
                <Text>
                  <Stack alignItems="center" gap="md">
                    <MonoKey />
                    Key sources
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
          </ul>
        </Box>
      </aside>
    </Box>
  );
};
