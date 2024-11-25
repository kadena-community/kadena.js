'use client';
import { AddAgentForm } from '@/components/AddAgentForm/AddAgentForm';
import { AgentsList } from '@/components/AgentsList/AgentsList';
import { SetComplianceForm } from '@/components/SetComplianceForm/SetComplianceForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAsset } from '@/hooks/asset';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';

export const OwnerRootPage = () => {
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { paused } = useAsset();
  const [hasOpenAgentForm, setHasOpenAgentForm] = useState(false);
  const [hasOpenComplianceForm, setHasOpenComplianceForm] = useState(false);

  const handleAddAgent = () => {
    setIsRightAsideExpanded(true);
    setHasOpenAgentForm(true);
    setHasOpenComplianceForm(false);
  };

  const handleComplianceForm = () => {
    setIsRightAsideExpanded(true);
    setHasOpenComplianceForm(true);
    setHasOpenAgentForm(false);
  };

  return (
    <Stack width="100%" flexDirection="column" gap="md">
      <SideBarBreadcrumbs />

      {isRightAsideExpanded && hasOpenComplianceForm && (
        <SetComplianceForm
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenAgentForm(false);
          }}
        />
      )}
      {isRightAsideExpanded && hasOpenAgentForm && (
        <AddAgentForm
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenAgentForm(false);
          }}
        />
      )}

      <Stack gap="sm">
        <Button
          isDisabled={paused}
          startVisual={<MonoAdd />}
          onClick={handleAddAgent}
        >
          Add Agent
        </Button>

        <Button
          isDisabled={paused}
          startVisual={<MonoAdd />}
          onClick={handleComplianceForm}
        >
          Set Compliance
        </Button>
      </Stack>

      <AgentsList />
    </Stack>
  );
};
