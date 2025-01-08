'use client';

import { DistributionForm } from '@/components/DistributionForm/DistributionForm';
import { FreezeInvestor } from '@/components/FreezeInvestor/FreezeInvestor';
import { InvestorForm } from '@/components/InvestorForm/InvestorForm';
import { InvestorInfo } from '@/components/InvestorInfo/InvestorInfo';
import { PartiallyFreezeTokensForm } from '@/components/PartiallyFreezeTokensForm/PartiallyFreezeTokensForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { TXTYPES } from '@/components/TransactionsProvider/TransactionsProvider';
import { TransactionTypeSpinner } from '@/components/TransactionTypeSpinner/TransactionTypeSpinner';
import { TransferForm } from '@/components/TransferForm/TransferForm';
import { useAccount } from '@/hooks/account';
import { useAddInvestor } from '@/hooks/addInvestor';
import { useDistributeTokens } from '@/hooks/distributeTokens';
import { useGetInvestor } from '@/hooks/getInvestor';
import { useTogglePartiallyFreezeTokens } from '@/hooks/togglePartiallyFreezeTokens';
import { MonoAdd, MonoEditNote } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useParams } from 'next/navigation';

const InvestorPage = () => {
  const params = useParams();
  const { accountRoles } = useAccount();
  const investorAccount = decodeURIComponent(params.investorAccount as string);
  const { isAllowed: isPartiallyFreezeTokensAllowed } =
    useTogglePartiallyFreezeTokens({
      investorAccount,
    });

  const { isAllowed: isDistributeTokensAllowed } = useDistributeTokens({
    investorAccount,
  });

  const { isAllowed: isEditInvestorAllowed } = useAddInvestor({
    investorAccount,
  });

  const { data: investor } = useGetInvestor({ account: investorAccount });

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
          {accountRoles.isTransferManager() && (
            <TransferForm
              investorAccount={investorAccount}
              isForced={true}
              trigger={<Button variant="warning">Forced transfer</Button>}
            />
          )}
          <DistributionForm
            investorAccount={investorAccount}
            trigger={
              <Button
                startVisual={
                  <TransactionTypeSpinner
                    type={TXTYPES.DISTRIBUTETOKENS}
                    account={investorAccount}
                    fallbackIcon={<MonoAdd />}
                  />
                }
                isDisabled={!isDistributeTokensAllowed}
              >
                Distribute Tokens
              </Button>
            }
          />

          <PartiallyFreezeTokensForm
            investorAccount={investorAccount}
            trigger={
              <Button
                startVisual={
                  <TransactionTypeSpinner
                    type={TXTYPES.PARTIALLYFREEZETOKENS}
                    account={investorAccount}
                    fallbackIcon={<MonoAdd />}
                  />
                }
                isDisabled={!isPartiallyFreezeTokensAllowed}
              >
                Partially freeze tokens
              </Button>
            }
          />

          <FreezeInvestor investorAccount={investorAccount} />

          <InvestorForm
            investor={investor}
            trigger={
              <Button
                isDisabled={!isEditInvestorAllowed}
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
