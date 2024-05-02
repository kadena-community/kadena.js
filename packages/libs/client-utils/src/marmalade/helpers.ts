import {
  COLLECTION_POLICY,
  GUARD_POLICY,
  ICreateTokenPolicyConfig,
  NON_FUNGIBLE_POLICY,
  ROYALTY_POLICY,
} from './config';

export const validatePolicies = (
  policyConfig?: ICreateTokenPolicyConfig,
  policies: string[] = [],
) => {
  if (policyConfig?.collection) {
    if (!policies.includes(COLLECTION_POLICY)) {
      throw new Error('Collection policy is required');
    }
  }

  if (policyConfig?.guarded || policyConfig?.upgradeableURI) {
    if (!policies.includes(GUARD_POLICY)) {
      throw new Error('Guard policy is required');
    }
  }

  if (policyConfig?.hasRoyalty) {
    if (!policies.includes(ROYALTY_POLICY)) {
      throw new Error('Royalty policy is required');
    }
  }

  if (policyConfig?.nonFungible) {
    if (!policies.includes(NON_FUNGIBLE_POLICY)) {
      throw new Error('Non-fungible policy is required');
    }
  }

  if (new Set(policies).size !== policies.length) {
    throw new Error('Duplicate policies are not allowed');
  }
};
