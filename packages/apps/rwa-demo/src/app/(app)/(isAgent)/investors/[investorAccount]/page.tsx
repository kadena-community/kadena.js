'use client';

import { DistributionForm } from '@/components/DistributionForm/DistributionForm';
import { FreezeInvestor } from '@/components/FreezeInvestor/FreezeInvestor';
import { InvestorInfo } from '@/components/InvestorInfo/InvestorInfo';
import { PartiallyFreezeTokensForm } from '@/components/PartiallyFreezeTokensForm/PartiallyFreezeTokensForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAsset } from '@/hooks/asset';
import { useFreeze } from '@/hooks/freeze';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const InvestorPage = () => {
  const { isRightAsideExpanded, setIsRightAsideExpanded } = useLayout();
  const { paused } = useAsset();
  const params = useParams();
  const [hasOpenDistributeForm, setHasOpenDistributeForm] = useState(false);
  const [hasOpenPartiallyFreezeForm, setHasOpenPartiallyFreezeForm] =
    useState(false);
  const investorAccount = decodeURIComponent(params.investorAccount as string);
  const { frozen } = useFreeze({ investorAccount });

  const handleDistributeTokens = () => {
    setIsRightAsideExpanded(true);
    setHasOpenDistributeForm(true);
  };
  const handlePartiallyFreezeTokens = () => {
    setIsRightAsideExpanded(true);
    setHasOpenPartiallyFreezeForm(true);
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
      {isRightAsideExpanded && hasOpenPartiallyFreezeForm && (
        <PartiallyFreezeTokensForm
          investorAccount={investorAccount}
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenPartiallyFreezeForm(false);
          }}
        />
      )}

      <Stack width="100%" flexDirection="column">
        <InvestorInfo investorAccount={investorAccount} />
        <Stack gap="sm">
          <Button
            startVisual={<MonoAdd />}
            onPress={handleDistributeTokens}
            isDisabled={frozen || paused}
          >
            Distribute Tokens
          </Button>

          <Button
            startVisual={<MonoAdd />}
            onPress={handlePartiallyFreezeTokens}
            isDisabled={frozen || paused}
          >
            Partially freeze tokens
          </Button>

          <FreezeInvestor investorAccount={investorAccount} />
        </Stack>
      </Stack>
    </>
  );
};

export default InvestorPage;
