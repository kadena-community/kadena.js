'use client';

import { AssetAction } from '@/components/AssetAction/AssetAction';
import { ComplianceRule } from '@/components/ComplianceRule/ComplianceRule';
import { InvestorBalance } from '@/components/InvestorBalance/InvestorBalance';
import { PauseAssetAction } from '@/components/PauseForm/PauseAssetAction';
import { SetComplianceForm } from '@/components/SetComplianceForm/SetComplianceForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { SupplyCount } from '@/components/SupplyCount/SupplyCount';
import { TransferForm } from '@/components/TransferForm/TransferForm';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useFreeze } from '@/hooks/freeze';
import { MonoAdd, MonoEditNote } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';

const Home = () => {
  const { isInvestor, isComplianceOwner, account } = useAccount();
  const { frozen } = useFreeze({ investorAccount: account?.address });
  const { paused, asset } = useAsset();

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
              {asset?.contractName}
              {asset?.namespace}
              <SupplyCount />

              {isInvestor && (
                <InvestorBalance investorAccount={account!.address} />
              )}
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
                      isDisabled={paused || !isComplianceOwner}
                      icon={<MonoAdd />}
                      label=" Set Compliance"
                    />
                  }
                />

                <TransferForm
                  trigger={
                    <AssetAction
                      isDisabled={paused || frozen || !isInvestor}
                      icon={<MonoAdd />}
                      label="Transfer tokens"
                    />
                  }
                />
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
                  {isComplianceOwner && (
                    <SetComplianceForm
                      trigger={
                        <Button
                          isCompact
                          variant="outlined"
                          isDisabled={paused}
                          endVisual={<MonoEditNote />}
                        >
                          Edit rules
                        </Button>
                      }
                    />
                  )}
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
