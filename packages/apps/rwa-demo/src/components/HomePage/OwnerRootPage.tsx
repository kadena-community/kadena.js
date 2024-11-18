'use client';
import { AddAgentForm } from '@/components/AddAgentForm/AddAgentForm';
import { AgentsList } from '@/components/AgentsList/AgentsList';
import { InitTokenForm } from '@/components/InitTokenForm/InitTokenForm';
import { SetComplianceForm } from '@/components/SetComplianceForm/SetComplianceForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { PauseForm } from '../PauseForm/PauseForm';

export const OwnerRootPage = () => {
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();

  const [hasOpenInitForm, setHasOpenInitForm] = useState(false);
  const [hasOpenAgentForm, setHasOpenAgentForm] = useState(false);
  const [hasOpenComplianceForm, setHasOpenComplianceForm] = useState(false);

  const handleAddAgent = () => {
    setIsRightAsideExpanded(true);
    setHasOpenInitForm(false);
    setHasOpenAgentForm(true);
    setHasOpenComplianceForm(false);
  };

  const handleInitToken = () => {
    setIsRightAsideExpanded(true);
    setHasOpenInitForm(true);
    setHasOpenComplianceForm(false);
    setHasOpenAgentForm(false);
  };

  const handleComplianceForm = () => {
    setIsRightAsideExpanded(true);
    setHasOpenComplianceForm(true);
    setHasOpenInitForm(false);
    setHasOpenAgentForm(false);
  };

  return (
    <Stack width="100%" flexDirection="column" gap="md">
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem href="/">Tokens</SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
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
      {isRightAsideExpanded && hasOpenInitForm && (
        <InitTokenForm
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenInitForm(false);
          }}
        />
      )}

      <Stack gap="sm">
        <PauseForm />

        <Button startVisual={<MonoAdd />} onClick={handleAddAgent}>
          Add Agent
        </Button>

        <Button startVisual={<MonoAdd />} onClick={handleComplianceForm}>
          Set Compliance
        </Button>

        <Button startVisual={<MonoAdd />} onClick={handleInitToken}>
          Init Token
        </Button>
      </Stack>

      <AgentsList />
    </Stack>
  );
};
