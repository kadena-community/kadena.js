'use client';

import { actionsWrapperClass } from '@/app/(app)/styles.css';
import { AssetAction } from '@/components/AssetAction/AssetAction';
import { DistributionForm } from '@/components/DistributionForm/DistributionForm';
import { FreezeInvestor } from '@/components/FreezeInvestor/FreezeInvestor';
import { InvestorForm } from '@/components/InvestorForm/InvestorForm';
import { InvestorInfo } from '@/components/InvestorInfo/InvestorInfo';
import { PartiallyFreezeTokensForm } from '@/components/PartiallyFreezeTokensForm/PartiallyFreezeTokensForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { TransactionTable } from '@/components/TransactionTable/TransactionTable';
import { TransactionTypeSpinner } from '@/components/TransactionTypeSpinner/TransactionTypeSpinner';
import { TransferForm } from '@/components/TransferForm/TransferForm';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useAccount } from '@/hooks/account';
import { useAddInvestor } from '@/hooks/addInvestor';
import { useDistributeTokens } from '@/hooks/distributeTokens';
import { useGetInvestor } from '@/hooks/getInvestor';
import { useTogglePartiallyFreezeTokens } from '@/hooks/togglePartiallyFreezeTokens';
import { MonoAdd, MonoEditNote } from '@kadena/kode-icons';
import { Stack } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  SideBarBreadcrumbsItem,
} from '@kadena/kode-ui/patterns';
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

      <Stack width="100%" flexDirection="column" gap="md">
        <SectionCard>
          <SectionCardContentBlock>
            <SectionCardHeader
              title="Investor"
              description={<InvestorInfo account={investor} />}
            />
            <SectionCardBody title="Actions">
              <Stack className={actionsWrapperClass}>
                {accountRoles.isTransferManager() && (
                  <TransferForm
                    investorAccount={investorAccount}
                    isForced={true}
                    trigger={
                      <AssetAction label="Forced transfer"></AssetAction>
                    }
                  />
                )}
                <DistributionForm
                  investorAccount={investorAccount}
                  trigger={
                    <AssetAction
                      data-testid="action-distributetokens"
                      icon={
                        <TransactionTypeSpinner
                          type={[TXTYPES.TOKENSFROZEN, TXTYPES.TOKENSUNFROZEN]}
                          account={investorAccount}
                          fallbackIcon={<MonoAdd />}
                        />
                      }
                      isDisabled={!isDistributeTokensAllowed}
                      label="Distribute Tokens"
                    />
                  }
                />

                <PartiallyFreezeTokensForm
                  investorAccount={investorAccount}
                  trigger={
                    <AssetAction
                      icon={
                        <TransactionTypeSpinner
                          type={TXTYPES.PARTIALLYFREEZETOKENS}
                          account={investorAccount}
                          fallbackIcon={<MonoAdd />}
                        />
                      }
                      isDisabled={!isPartiallyFreezeTokensAllowed}
                      label="Partially freeze tokens"
                    />
                  }
                />

                <FreezeInvestor
                  investorAccount={investorAccount}
                  trigger={<AssetAction label="" />}
                />

                <InvestorForm
                  investor={investor}
                  trigger={
                    <AssetAction
                      isDisabled={!isEditInvestorAllowed}
                      icon={<MonoEditNote />}
                      label="Edit Investor"
                    />
                  }
                />
              </Stack>
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>

        <SectionCard stack="vertical">
          <SectionCardContentBlock>
            <SectionCardHeader
              title="Transactions"
              description={<>All transactions for this investor</>}
            />
            <SectionCardBody>
              <TransactionTable investor={investor} />
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>
      </Stack>
    </>
  );
};

export default InvestorPage;
