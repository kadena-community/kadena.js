'use client';
import { AddAgentForm } from '@/components/AddAgentForm/AddAgentForm';
import { InitTokenForm } from '@/components/InitTokenForm/InitTokenForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { MonoAdd } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
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
    <div>
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
      <Button startVisual={<MonoAdd />} onClick={handleAddAgent}>
        Add Agent
      </Button>

      <Button startVisual={<MonoAdd />} onClick={handleInitToken}>
        Init Token
      </Button>
    </div>
  );
};

export default Home;
