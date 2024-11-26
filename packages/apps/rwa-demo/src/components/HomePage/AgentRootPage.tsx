import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useState } from 'react';
import { AddInvestorForm } from '../AddInvestorForm/AddInvestorForm';
import { InvestorList } from '../InvestorList/InvestorList';
import { PauseForm } from '../PauseForm/PauseForm';

export const AgentRootPage: FC = () => {
  const { isAgent, account } = useAccount();
  const { paused } = useAsset();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [hasOpenInvestorForm, setHasOpenInvestorForm] = useState(false);

  const handleAddInvestor = () => {
    setIsRightAsideExpanded(true);
    setHasOpenInvestorForm(true);
  };

  if (!isAgent) return null;

  return (
    <Stack width="100%" flexDirection="column" gap="md">
      agent: {account?.address}
      <SideBarBreadcrumbs />
      {isRightAsideExpanded && hasOpenInvestorForm && (
        <AddInvestorForm
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenInvestorForm(false);
          }}
        />
      )}
      <Stack gap="sm">
        <PauseForm />
        <Button
          isDisabled={paused}
          startVisual={<MonoAdd />}
          onPress={handleAddInvestor}
        >
          Add Investor
        </Button>
      </Stack>
      <InvestorList />
    </Stack>
  );
};
