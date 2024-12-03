'use client';
import { AgentsList } from '@/components/AgentsList/AgentsList';
import { SetComplianceForm } from '@/components/SetComplianceForm/SetComplianceForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';

export const OwnerRootPage = () => {
  const { isComplianceOwner } = useAccount();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { paused } = useAsset();
  const [hasOpenComplianceForm, setHasOpenComplianceForm] = useState(false);

  const handleComplianceForm = () => {
    setIsRightAsideExpanded(true);
    setHasOpenComplianceForm(true);
  };

  return (
    <Stack width="100%" flexDirection="column" gap="md">
      <SideBarBreadcrumbs />

      {isRightAsideExpanded && hasOpenComplianceForm && (
        <SetComplianceForm
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenComplianceForm(false);
          }}
        />
      )}

      <Stack gap="sm">
        {isComplianceOwner && (
          <Button
            isDisabled={paused}
            startVisual={<MonoAdd />}
            onClick={handleComplianceForm}
          >
            Set Compliance
          </Button>
        )}
      </Stack>

      <AgentsList />
    </Stack>
  );
};
