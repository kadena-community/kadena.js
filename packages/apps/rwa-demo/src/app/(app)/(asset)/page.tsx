'use client';

import { AssetAction } from '@/components/AssetAction/AssetAction';
import { TransferAssetAction } from '@/components/AssetAction/TransferAssetAction';
import { AssetSetupCompletionOverview } from '@/components/AssetSetupCompletionOverview/AssetSetupCompletionOverview';
import { BatchTransferAssetAction } from '@/components/BatchTransferAsset/BatchTransferAssetAction';
import { ComplianceRules } from '@/components/ComplianceRules/ComplianceRules';
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
import { useOrganisation } from '@/hooks/organisation';
import { useSetCompliance } from '@/hooks/setCompliance';
import { MonoAdd, MonoEditNote } from '@kadena/kode-icons';
import { Button, Link, Stack } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  SideBarBreadcrumbsItem,
} from '@kadena/kode-ui/patterns';
import { actionsWrapperClass } from './../styles.css';

const Home = () => {
  const { asset } = useAsset();
  const { organisation } = useOrganisation();
  const { isInvestor, account } = useAccount();
  const { isAllowed: isSetComplianceAllowed } = useSetCompliance();

  if (!organisation) return null;

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/">
          {organisation.name}
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <Stack width="100%" flexDirection="column" gap="md">
        <AssetSetupCompletionOverview asset={asset} />
        <SectionCard data-testid="contractCard">
          <SectionCardContentBlock>
            <SectionCardHeader
              title="Contract details"
              description={<>All you need to know about the contract</>}
            />
            <SectionCardBody>
              <Stack width="100%" className={contractDetailWrapperClass}>
                <ContractDetails
                  data-testid="contractName"
                  label="Name"
                  value={asset?.contractName}
                />
                <ContractDetails
                  data-testid="namespace"
                  label="Namespace"
                  value={asset?.namespace}
                />
                <ContractDetails
                  data-testid="tokenSupply"
                  label="Total token supply"
                  value={<SupplyCountContractDetails />}
                />

                {isInvestor && (
                  <ContractDetails
                    data-testid="balance"
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

        <SectionCard data-testid="assetCard">
          <SectionCardContentBlock>
            <SectionCardHeader title="Asset" description={<></>} />
            <SectionCardBody title="Actions">
              <Stack className={actionsWrapperClass}>
                <PauseAssetAction data-testid="pauseAction" />

                <SetComplianceForm
                  trigger={
                    <AssetAction
                      data-testid="complianceAction"
                      isDisabled={!isSetComplianceAllowed}
                      icon={<MonoAdd />}
                      label="Set Compliance"
                    />
                  }
                />

                <TransferForm
                  investorAccount={account?.address!}
                  trigger={
                    <TransferAssetAction data-testid="transferassetAction" />
                  }
                />

                <BatchTransferAssetAction data-testid="batchTransferAction" />
              </Stack>
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>

        <SectionCard data-testid="complianceCard">
          <SectionCardContentBlock>
            <SectionCardHeader
              title="Compliance rules"
              description={<></>}
              actions={
                <>
                  <SetComplianceForm
                    trigger={
                      <Button
                        aria-label="Edit compliance rules"
                        data-testid="editrules"
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
              {asset && <ComplianceRules asset={asset} />}
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>
      </Stack>
    </>
  );
};

export default Home;
