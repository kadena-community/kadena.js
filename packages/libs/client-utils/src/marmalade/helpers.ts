import type { ISigner } from '@kadena/client';
import { addSigner } from '@kadena/client/fp';
import type { IGeneralCapability } from '@kadena/client/lib/interfaces/type-utilities';
import type { ICap } from '@kadena/types';
import type {
  CommonProps,
  Guard,
  ICreateTokenPolicyConfig,
  Keyset,
  RefKeyset,
} from './config';
import {
  COLLECTION_POLICY,
  GUARD_POLICY,
  NON_FUNGIBLE_POLICY,
  NON_UPDATABLE_URI_POLICY,
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

  if (policyConfig?.guarded) {
    if (!policies.includes(GUARD_POLICY)) {
      throw new Error('Guard policy is required');
    }
  }

  if (policyConfig?.nonUpdatableURI === true) {
    if (!policies.includes(NON_UPDATABLE_URI_POLICY)) {
      throw new Error('Non-updatable URI policy is required');
    }
  }

  if (policyConfig?.nonUpdatableURI === false) {
    if (!policies.includes(GUARD_POLICY)) {
      throw new Error('Guard policy is required for updatable URI');
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
    addSigner(signer.keys, (signFor) =>
      formatCapabilities(signer.capabilities, signFor),
    ),
  );

export const formatWebAuthnSigner = (
  signer: ISigner | ISigner[],
): ISigner | ISigner[] => {
  const formatSingleSigner = (s: ISigner): ISigner => {
    if (typeof s === 'string' && s.startsWith('WEBAUTHN')) {
      return { pubKey: s, scheme: 'WebAuthn' } as ISigner;
    }
    return s;
  };

  if (Array.isArray(signer)) {
    return signer.map(formatSingleSigner);
  }

  return formatSingleSigner(signer);
};

export const isKeysetGuard = (guard: Guard): guard is Keyset => {
  return 'keys' in guard;
};

export const isRefKeysetGuard = (guard: Guard): guard is RefKeyset => {
  return 'keysetref' in guard;
};

export const readRefKeyset = (guard: RefKeyset) => {
  return () =>
    `(keyset-ref-guard "${guard.keysetref.ns}.${guard.keysetref.ksn}")`;
};
