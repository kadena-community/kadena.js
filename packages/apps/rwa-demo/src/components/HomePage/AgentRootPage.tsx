import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import { InvestorList } from '../InvestorList/InvestorList';
import { PauseForm } from '../PauseForm/PauseForm';

export const AgentRootPage: FC = () => {
  const { isAgent, account } = useAccount();

  if (!isAgent) return null;

  return (
    <Stack width="100%" flexDirection="column" gap="md">
      agent: {account?.address}
      <SideBarBreadcrumbs />
      <Stack gap="sm">
        <PauseForm />
      </Stack>
      <InvestorList />
    </Stack>
  );
};
