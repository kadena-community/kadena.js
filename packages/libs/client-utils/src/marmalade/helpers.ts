import { addSigner } from '@kadena/client/fp';
import type { IGeneralCapability } from '@kadena/client/lib/interfaces/type-utilities';
import type { ICap } from '@kadena/types';
import type { CommonProps, ICreateTokenPolicyConfig } from './config';
import {
  COLLECTION_POLICY,
  GUARD_POLICY,
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

  if (policyConfig?.guarded || policyConfig?.updatableURI) {
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

export const formatCapabilities = (
  capabilities: CommonProps['capabilities'] = [],
  signFor: IGeneralCapability,
): ICap[] =>
  capabilities.map((capability) =>
    signFor(capability.name, ...capability.props),
  );

export const formatAdditionalSigners = (
  additionalSigners: CommonProps['additionalSigners'] = [],
): any[] =>
  additionalSigners.map((signer) =>
    addSigner(signer.keyset.keys, (signFor) =>
      formatCapabilities(signer.capabilities, signFor),
    ),
  );