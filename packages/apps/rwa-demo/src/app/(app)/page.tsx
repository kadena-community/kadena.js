'use client';

import { AssetAction } from '@/components/AssetAction/AssetAction';
import { TransferAssetAction } from '@/components/AssetAction/TransferAssetAction';
import { ComplianceRule } from '@/components/ComplianceRule/ComplianceRule';
import { ContractDetails } from '@/components/ContractDetails/ContractDetails';
import { contractDetailWrapperClass } from '@/components/ContractDetails/style.css';
import { InvestorBalance } from '@/components/InvestorBalance/InvestorBalance';
import { PauseAssetAction } from '@/components/PauseForm/PauseAssetAction';
import { SetComplianceForm } from '@/components/SetComplianceForm/SetComplianceForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { SupplyCountContractDetails } from '@/components/SupplyCountContractDetails/SupplyCountContractDetails';
import { TransferForm } from '@/components/TransferForm/TransferForm';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useSetCompliance } from '@/hooks/setCompliance';
import { MonoAdd, MonoEditNote } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';

const Home = () => {
  const { isInvestor, account } = useAccount();
  const { asset } = useAsset();
  const { isAllowed: isSetComplianceAllowed } = useSetCompliance();

  return (
    <>
      <SideBarBreadcrumbs />

      <Stack width="100%" flexDirection="column" gap="md">
        <SectionCard>
          <SectionCardContentBlock>
            <SectionCardHeader
              title="Contract details"
              description={<>All you need to know about the contract</>}
            />
            <SectionCardBody>
              <Stack width="100%" className={contractDetailWrapperClass}>
                <ContractDetails label="Name" value={asset?.contractName} />
                <ContractDetails label="Namespace" value={asset?.namespace} />
                <ContractDetails
                  label="Total token supply"
                  value={<SupplyCountContractDetails />}
                />

                {isInvestor && (
                  <ContractDetails
                    label="Investor balance"
                    value={
                      <InvestorBalance
                        investorAccount={account!.address}
                        short
                      />
                    }
                  />
                )}
              </Stack>
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>

        <SectionCard>
          <SectionCardContentBlock>
            <SectionCardHeader title="Asset" description={<></>} />
            <SectionCardBody title="Actions">
              <Stack width="100%" justifyContent="space-between" gap="sm">
                <PauseAssetAction />

                <SetComplianceForm
                  trigger={
                    <AssetAction
                      isDisabled={!isSetComplianceAllowed}
                      icon={<MonoAdd />}
                      label=" Set Compliance"
                    />
                  }
                />

                <TransferForm trigger={<TransferAssetAction />} />
              </Stack>
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>

        <SectionCard>
          <SectionCardContentBlock>
            <SectionCardHeader
              title="Compliance rules"
              description={<></>}
              actions={
                <>
                  <SetComplianceForm
                    trigger={
                      <Button
                        isCompact
                        variant="outlined"
                        isDisabled={!isSetComplianceAllowed}
                        endVisual={<MonoEditNote />}
                      >
                        Edit rules
                      </Button>
                    }
                  />
                </>
              }
            />
            <SectionCardBody>
              {asset && (
                <>
                  <ComplianceRule
                    value={asset.maxSupply}
                    label="Supply limit"
                  />
                  <ComplianceRule
                    value={asset.maxBalance}
                    label="Max balance"
                  />
                  <ComplianceRule
                    value={`${asset.maxInvestors} (${asset.investorCount})`}
                    label="Max Investors"
                  />
                </>
              )}
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>
      </Stack>
    </>
  );
};

export default Home;
