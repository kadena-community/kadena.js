'use client';

import { DistributionForm } from '@/components/DistributionForm/DistributionForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const InvestorPage = () => {
  const { isRightAsideExpanded, setIsRightAsideExpanded } = useLayout();
  const params = useParams();
  const [hasOpenDistributeForm, setHasOpenDistributeForm] = useState(false);
  const investorAccount = decodeURIComponent(params.investorAccount as string);

  const handleDistributeTokens = () => {
    setIsRightAsideExpanded(true);
    setHasOpenDistributeForm(true);
  };

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem href={`/investors/${investorAccount}`}>
          Investor
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      {isRightAsideExpanded && hasOpenDistributeForm && (
        <DistributionForm
          investorAccount={investorAccount}
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenDistributeForm(false);
          }}
        />
      )}

      <Stack width="100%" flexDirection="column">
        <Heading>Investor: {investorAccount}</Heading>
        <Stack gap="sm">
          <Button startVisual={<MonoAdd />} onPress={handleDistributeTokens}>
            Distribute Tokens
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default InvestorPage;
