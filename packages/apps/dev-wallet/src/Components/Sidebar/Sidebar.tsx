import { MonoDataThresholding, MonoSignature } from '@kadena/kode-icons';
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
        <Text transform="uppercase" size="smallest">
          Pages
        </Text>
        <Box marginBlockStart="md">
          <ul className={sidebarMenuClass}>
            <li className={sidebarMenuOptionClass}>
              <NavLink to="/" className={sidebarLinkClass}>
                <Stack alignItems="center" gap="md">
                  <MonoDataThresholding></MonoDataThresholding>
                  Dashboard
                </Stack>
              </NavLink>
            </li>
            <li className={sidebarMenuOptionClass}>
              <NavLink to="/sig-builder" className={sidebarLinkClass}>
                <Stack alignItems="center" gap="md">
                  <MonoSignature></MonoSignature>
                  Sig Builder
                </Stack>
              </NavLink>
            </li>
          </ul>
        </Box>
      </aside>
    </Box>
  );
};
