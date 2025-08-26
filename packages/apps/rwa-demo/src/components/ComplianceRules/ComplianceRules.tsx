import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useSetCompliance } from '@/hooks/setCompliance';
import type { FC } from 'react';
import { ComplianceRule } from '../ComplianceRule/ComplianceRule';

export const ComplianceRules: FC<{ asset: IAsset }> = ({ asset }) => {
  const { toggleComplianceRule } = useSetCompliance();

  if (!asset) return null;

  return (
    <>
      <ComplianceRule
        data-testid="compliance-maxSupply"
        isActive={asset.compliance.maxSupply.isActive}
        ruleKey={asset.compliance.maxSupply.key}
        value={`${asset.compliance.maxSupply.value < 0 ? 'no limit' : asset.compliance.maxSupply.value} tokens`}
        label="Supply limit"
        onToggle={toggleComplianceRule}
      />
      <ComplianceRule
        data-testid="compliance-maxBalance"
        isActive={asset.compliance.maxBalance.isActive}
        ruleKey={asset.compliance.maxBalance.key}
        value={`${asset.compliance.maxBalance.value < 0 ? 'no limit' : asset.compliance.maxBalance.value} tokens`}
        label="Max balance"
        onToggle={toggleComplianceRule}
      />
      <ComplianceRule
        data-testid="compliance-maxInvestors"
        isActive={asset.compliance.maxInvestors.isActive}
        ruleKey={asset.compliance.maxInvestors.key}
        value={`${asset.compliance.maxInvestors.value < 0 ? 'no limit' : asset.compliance.maxInvestors.value} (${asset.investorCount}) investors`}
        label="Max Investors"
        onToggle={toggleComplianceRule}
      />
    </>
  );
};
