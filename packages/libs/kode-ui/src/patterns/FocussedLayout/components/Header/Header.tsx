import type { FC } from 'react';
import React from 'react';
import { Stack } from './../../../../components';
import { KLogoText } from './../../../SideBarLayout/components/Logo/KLogoText';

export const Header: FC = () => {
  return (
    <Stack width="100%" marginBlockStart="md" marginBlockEnd="xxxl">
      <KLogoText />
      <Stack flex={1}>left</Stack>
      <Stack>right</Stack>
    </Stack>
  );
};
