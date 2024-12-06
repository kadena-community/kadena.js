'use client';

import { DistributionForm } from '@/components/DistributionForm/DistributionForm';
import { FreezeInvestor } from '@/components/FreezeInvestor/FreezeInvestor';
import { InvestorForm } from '@/components/InvestorForm/InvestorForm';
import { InvestorInfo } from '@/components/InvestorInfo/InvestorInfo';
import { PartiallyFreezeTokensForm } from '@/components/PartiallyFreezeTokensForm/PartiallyFreezeTokensForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAsset } from '@/hooks/asset';
import { useFreeze } from '@/hooks/freeze';
import { useGetInvestor } from '@/hooks/getInvestor';
import { MonoAdd, MonoEditNote } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useParams } from 'next/navigation';

const InvestorPage = () => {
  const { paused } = useAsset();
  const params = useParams();
  const investorAccount = decodeURIComponent(params.investorAccount as string);

  const { data: investor } = useGetInvestor({ account: investorAccount });
  const { frozen } = useFreeze({ investorAccount });

  if (!investor) return null;

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem href={`/investors/${investorAccount}`}>
          Investor
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack width="100%" flexDirection="column">
        <InvestorInfo account={investor} />
        <Stack gap="sm">
          <DistributionForm
            investorAccount={investorAccount}
            trigger={
              <Button startVisual={<MonoAdd />} isDisabled={frozen || paused}>
                Distribute Tokens
              </Button>
            }
          />

          <PartiallyFreezeTokensForm
            investorAccount={investorAccount}
            trigger={
              <Button startVisual={<MonoAdd />} isDisabled={frozen || paused}>
                Partially freeze tokens
              </Button>
            }
          />

          <FreezeInvestor investorAccount={investorAccount} />

          <InvestorForm
            investor={investor}
            trigger={
              <Button
                isDisabled={frozen || paused}
                endVisual={<MonoEditNote />}
              >
                Edit Investor
              </Button>
            }
          />
        </Stack>
      </Stack>
    </>
  );
};

export default InvestorPage;
