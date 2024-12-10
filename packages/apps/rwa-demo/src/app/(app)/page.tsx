'use client';

import { ComplianceRule } from '@/components/ComplianceRule/ComplianceRule';
import { InvestorBalance } from '@/components/InvestorBalance/InvestorBalance';
import { PauseForm } from '@/components/PauseForm/PauseForm';
import { SetComplianceForm } from '@/components/SetComplianceForm/SetComplianceForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { SupplyCount } from '@/components/SupplyCount/SupplyCount';
import { TransferForm } from '@/components/TransferForm/TransferForm';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { MonoAdd, MonoEditNote } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';

const Home = () => {
  const { isInvestor, isComplianceOwner, account } = useAccount();
  const { paused, asset } = useAsset();

  return (
    <>
      <SideBarBreadcrumbs />

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
            <PauseForm />
            {isComplianceOwner && (
              <SetComplianceForm
                trigger={
                  <Button isDisabled={paused} startVisual={<MonoAdd />}>
                    Set Compliance
                  </Button>
                }
              />
            )}
            {isInvestor && (
              <TransferForm
                trigger={
                  <Button isDisabled={paused} startVisual={<MonoAdd />}>
                    Transfer tokens
                  </Button>
                }
              />
            )}
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
                <ComplianceRule value={asset.maxSupply} label="Supply limit" />
                <ComplianceRule value={asset.maxBalance} label="Max balance" />
              </>
            )}
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};

export default Home;
