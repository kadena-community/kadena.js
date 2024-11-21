'use client';

import { DistributionForm } from '@/components/DistributionForm/DistributionForm';
import { FreezeInvestor } from '@/components/FreezeInvestor/FreezeInvestor';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';
import { isFrozen } from '@/services/isFrozen';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const InvestorPage = () => {
  const { isRightAsideExpanded, setIsRightAsideExpanded } = useLayout();
  const { account } = useAccount();
  const params = useParams();
  const [hasOpenDistributeForm, setHasOpenDistributeForm] = useState(false);
  const investorAccount = decodeURIComponent(params.investorAccount as string);
  const [paused, setPaused] = useState(false);

  const handleDistributeTokens = () => {
    setIsRightAsideExpanded(true);
    setHasOpenDistributeForm(true);
  };

  const init = async () => {
    const res = await isFrozen({
      investorAccount: investorAccount,
      account: account!,
    });

    if (typeof res === 'boolean') {
      setPaused(res);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, []);

  const handlePauseChange = (pausedResult: boolean) => setPaused(pausedResult);

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
          <Button
            startVisual={<MonoAdd />}
            onPress={handleDistributeTokens}
            isDisabled={paused}
          >
            Distribute Tokens
          </Button>
          <FreezeInvestor
            investorAccount={investorAccount}
            onChanged={handlePauseChange}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default InvestorPage;
