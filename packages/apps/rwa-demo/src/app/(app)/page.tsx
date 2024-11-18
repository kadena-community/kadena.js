'use client';
import { AddAgentForm } from '@/components/AddAgentForm/AddAgentForm';
import { AgentsList } from '@/components/AgentsList/AgentsList';
import { InitTokenForm } from '@/components/InitTokenForm/InitTokenForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';

const Home = () => {
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [hasOpenInitForm, setHasOpenInitForm] = useState(false);
  const [hasOpenAgentForm, setHasOpenAgentForm] = useState(false);

  const handleAddAgent = () => {
    setIsRightAsideExpanded(true);
    setHasOpenAgentForm(true);
  };

  const handleInitToken = () => {
    setIsRightAsideExpanded(true);
    setHasOpenInitForm(true);
  };

  return (
    <Stack width="100%" flexDirection="column" gap="md">
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem href="/">Tokens</SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
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
        <Button startVisual={<MonoAdd />} onClick={handleAddAgent}>
          Add Agent
        </Button>

        <Button startVisual={<MonoAdd />} onClick={handleInitToken}>
          Init Token
        </Button>
      </Stack>

      <AgentsList />
    </Stack>
  );
};

export default Home;
