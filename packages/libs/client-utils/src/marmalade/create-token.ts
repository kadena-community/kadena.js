import type {
  ChainId,
  ICap,
  IPactModules,
  IPartialPactCommand,
  PactReference,
  PactReturnType,
} from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addData,
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { ValidDataTypes } from '@kadena/client/lib/composePactCommand/utils/addData';
import type { IGeneralCapability } from '@kadena/client/lib/interfaces/type-utilities';
import type { IPactInt } from '@kadena/types';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import type {
  CommonProps,
  Guard,
  ICreateTokenPolicyConfig,
  PolicyProps,
  WithCreateTokenPolicy,
} from './config';
import {
  formatAdditionalSigners,
  formatCapabilities,
  formatWebAuthnSigner,
  isKeysetGuard,
  isRefKeysetGuard,
  readRefKeyset,
  validatePolicies,
} from './helpers';

interface ICreateTokenInput extends CommonProps {
  policies?: string[];
  uri: string;
  tokenId: string;
  precision: IPactInt | PactReference;
  chainId: ChainId;
  signerPublicKey?: string;
  creator: {
    account: string;
    guard: Guard;
  };
}

const generatePolicyCapabilities = (
  policyConfig: ICreateTokenPolicyConfig,
  props: PolicyProps & { tokenId: string },
  signFor: IGeneralCapability,
): ICap[] => {
  const capabilities = [];

  if (policyConfig?.collection) {
    capabilities.push(
      signFor(
        'marmalade-v2.collection-policy-v1.TOKEN-COLLECTION',
        props.collection.collectionId,
        props.tokenId,
      ),
    );
  }

  return capabilities;
};

const generatePolicyTransactionData = (
  policyConfig: ICreateTokenPolicyConfig,
  props: PolicyProps,
): ((cmd: IPartialPactCommand) => IPartialPactCommand)[] => {
  const data = [];

  if (policyConfig?.collection) {
    data.push(addData('collection_id', props.collection.collectionId));
  }

  if (policyConfig?.guarded) {
    if (props.guards.mintGuard)
      data.push(
        addData(
          'mint_guard',
          props.guards.mintGuard as unknown as ValidDataTypes,
        ),
      );
    if (props.guards.burnGuard)
      data.push(
        addData(
          'burn_guard',
          props.guards.burnGuard as unknown as ValidDataTypes,
        ),
      );
    if (props.guards.saleGuard)
      data.push(
        addData(
          'sale_guard',
          props.guards.saleGuard as unknown as ValidDataTypes,
        ),
      );
    if (props.guards.transferGuard)
      data.push(
        addData(
          'transfer_guard',
          props.guards.transferGuard as unknown as ValidDataTypes,
        ),
      );
    if (props.guards.uriGuard)
      data.push(
        addData(
          'uri_guard',
          props.guards.uriGuard as unknown as ValidDataTypes,
        ),
      );
  }

  if (policyConfig?.hasRoyalty) {
    data.push(
      addData('royalty_spec', {
        fungible: props.royalty.fungible,
        creator: props.royalty.creator.account,
        'creator-guard': props.royalty.creator.guard,
        'royalty-rate': props.royalty.royaltyRate.decimal,
      }),
    );
  }

  if (!policyConfig?.guarded && policyConfig?.nonUpdatableURI === false) {
    throw new Error('Guard policy must be used with updatable URI tokens');
  }

  if (policyConfig?.guarded && policyConfig?.nonUpdatableURI === false) {
    if (!props.guards.uriGuard) {
      throw new Error('Updatable tokens require "uriGuard"');
    }
  }

  if (policyConfig?.customPolicies) {
    for (const key of Object.keys(props.customPolicyData)) {
      data.push(addData(key, props.customPolicyData[key]));
    }
  }

  return data;
};

const createTokenCommand = <C extends ICreateTokenPolicyConfig>({
  policies = [],
  uri,
  tokenId,
  precision,
  creator,
  chainId,
  policyConfig,
  meta,
  capabilities,
  signerPublicKey,
  additionalSigners,
  ...policyProps
}: WithCreateTokenPolicy<C, ICreateTokenInput>) => {
  validatePolicies(policyConfig as ICreateTokenPolicyConfig, policies);

  if (!isKeysetGuard(creator.guard) && !signerPublicKey) {
    throw new Error('Keyset references must assign a signer publicKey');
  }

  if (isKeysetGuard(creator.guard)) {
    return composePactCommand(
      execution(
        Pact.modules['marmalade-v2.ledger']['create-token'](
          tokenId,
          precision,
          uri,
          () => (policies.length > 0 ? `[${policies.join(' ')}]` : '[]'),
          readKeyset('creation-guard'),
        ),
      ),
      setMeta({ senderAccount: creator.account, chainId }),
      addKeyset('creation-guard', creator.guard.pred, ...creator.guard.keys),
      addSigner(formatWebAuthnSigner(creator.guard.keys), (signFor) => [
        signFor('coin.GAS'),
        signFor('marmalade-v2.ledger.CREATE-TOKEN', tokenId, creator.guard),
        ...generatePolicyCapabilities(
          policyConfig as ICreateTokenPolicyConfig,
          { ...policyProps, tokenId } as unknown as PolicyProps & {
            tokenId: string;
          },
          signFor,
        ),
        ...formatCapabilities(capabilities, signFor),
      ]),
      ...generatePolicyTransactionData(
        policyConfig as ICreateTokenPolicyConfig,
        policyProps as unknown as PolicyProps,
      ),
      ...formatAdditionalSigners(additionalSigners),
      setMeta({ senderAccount: creator.account, chainId, ...meta }),
    );
  } else if (isRefKeysetGuard(creator.guard)) {
    return composePactCommand(
      execution(
        Pact.modules['marmalade-v2.ledger']['create-token'](
          tokenId,
          precision,
          uri,
          () => (policies.length > 0 ? `[${policies.join(' ')}]` : '[]'),
          readRefKeyset(creator.guard),
        ),
      ),
      setMeta({ senderAccount: signerPublicKey, chainId }),
      addSigner(formatWebAuthnSigner(signerPublicKey!), (signFor) => [
        signFor('coin.GAS'),
        signFor('marmalade-v2.ledger.CREATE-TOKEN', tokenId, creator.guard),
        ...generatePolicyCapabilities(
          policyConfig as ICreateTokenPolicyConfig,
          { ...policyProps, tokenId } as unknown as PolicyProps & {
            tokenId: string;
          },
          signFor,
        ),
        ...formatCapabilities(capabilities, signFor),
      ]),
      ...generatePolicyTransactionData(
        policyConfig as ICreateTokenPolicyConfig,
        policyProps as unknown as PolicyProps,
      ),
      ...formatAdditionalSigners(additionalSigners),
      setMeta({ senderAccount: creator.account, chainId, ...meta }),
    );
  } else {
    throw new Error('Guard type is not supported');
  }
};

export const createToken = <C extends ICreateTokenPolicyConfig>(
  inputs: WithCreateTokenPolicy<C, ICreateTokenInput>,
  config: IClientConfig,
) => {
  return submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['create-token']>
  >(config)(createTokenCommand(inputs));
};
