import type { IComplianceProps } from '@/services/getComplianceRules';
import { getActiveRulesKeys } from '../getActiveRulesKeys';

describe('getActiveRulesKeys utils', () => {
  it('should return only the given rule if that is set to active and there are no other active rules', () => {
    const rules: IComplianceProps = {
      maxBalance: {
        key: 'max-balance-compliance-v1',
        isActive: false,
        value: -1,
      },
      maxInvestors: {
        key: 'max-investors-compliance-v1',
        isActive: false,
        value: -1,
      },
      maxSupply: {
        key: 'supply-limit-compliance-v1',
        isActive: false,
        value: -1,
      },
    };

    const result = getActiveRulesKeys(
      rules,
      'supply-limit-compliance-v1',
      true,
    );
    expect(result).toEqual(['supply-limit-compliance-v1']);
  });

  it('should return the active rules, when the new rule is active', () => {
    const rules: IComplianceProps = {
      maxBalance: {
        key: 'max-balance-compliance-v1',
        isActive: true,
        value: -1,
      },
      maxInvestors: {
        key: 'max-investors-compliance-v1',
        isActive: false,
        value: -1,
      },
      maxSupply: {
        key: 'supply-limit-compliance-v1',
        isActive: false,
        value: -1,
      },
    };

    const result = getActiveRulesKeys(
      rules,
      'supply-limit-compliance-v1',
      true,
    );
    expect(result).toEqual([
      'max-balance-compliance-v1',
      'supply-limit-compliance-v1',
    ]);
  });

  it('should return the active rules, when the new rule is NOT active', () => {
    const rules: IComplianceProps = {
      maxBalance: {
        key: 'max-balance-compliance-v1',
        isActive: true,
        value: -1,
      },
      maxInvestors: {
        key: 'max-investors-compliance-v1',
        isActive: false,
        value: -1,
      },
      maxSupply: {
        key: 'supply-limit-compliance-v1',
        isActive: true,
        value: -1,
      },
    };

    const result = getActiveRulesKeys(
      rules,
      'max-balance-compliance-v1',
      false,
    );
    expect(result).toEqual(['supply-limit-compliance-v1']);
  });
});
