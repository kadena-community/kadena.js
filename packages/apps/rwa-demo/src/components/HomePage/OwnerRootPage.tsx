'use client';
import { AgentsList } from '@/components/AgentsList/AgentsList';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { Stack } from '@kadena/kode-ui';

export const OwnerRootPage = () => {
  return (
    <Stack width="100%" flexDirection="column" gap="md">
      <SideBarBreadcrumbs />

      <AgentsList />
    </Stack>
  );
};
