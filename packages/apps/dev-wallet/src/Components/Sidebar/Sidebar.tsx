import {
  MonoDataThresholding,
  MonoKey,
  MonoSignature,
  MonoTrendingUp,
} from '@kadena/react-icons';
import { Box, Stack, Text } from '@kadena/react-ui';
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
        <Text transform="uppercase" size="smallest">
          Pages
        </Text>
        <Box marginBlockStart="md">
          <ul className={sidebarMenuClass}>
            <li className={sidebarMenuOptionClass}>
              <NavLink to="/" className={sidebarLinkClass}>
                <Stack alignItems="center" gap="md">
                  <MonoDataThresholding></MonoDataThresholding>
                  <Text>Dashboard</Text>
                </Stack>
              </NavLink>
            </li>
            <li className={sidebarMenuOptionClass}>
              <NavLink to="/sig-builder" className={sidebarLinkClass}>
                <Stack alignItems="center" gap="md">
                  <MonoSignature />
                  Sig Builder
                </Stack>
              </NavLink>
            </li>
            <li className={sidebarMenuOptionClass}>
              <NavLink to="/key-sources" className={sidebarLinkClass}>
                <Stack alignItems="center" gap="md">
                  <MonoKey />
                  Key sources
                </Stack>
              </NavLink>
            </li>
            <li className={sidebarMenuOptionClass}>
              <NavLink to="/transfer" className={sidebarLinkClass}>
                <Stack alignItems="center" gap="md">
                  <MonoTrendingUp />
                  Transfer
                </Stack>
              </NavLink>
            </li>
          </ul>
        </Box>
      </aside>
    </Box>
  );
};
