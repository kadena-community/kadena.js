import type {
  IComplianceProps,
  IComplianceRuleTypes,
} from '@/services/getComplianceRules';

export const getActiveRulesKeys = (
  complianceRules: IComplianceProps,
  newRuleKey: string,
  newRuleNewState: boolean,
): IComplianceRuleTypes[] => {
  return Object.entries(complianceRules).reduce((acc, [_, val]) => {
    if (
      (val.isActive && newRuleKey !== val.key) ||
      (newRuleKey === val.key && newRuleNewState)
    ) {
      acc.push(val.key);
    }

    return acc;
  }, [] as IComplianceRuleTypes[]);
};
