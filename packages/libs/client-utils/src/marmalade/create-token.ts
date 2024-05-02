import type {
  BuiltInPredicate,
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
import type { IGeneralCapability } from '@kadena/client/lib/interfaces/type-utilities';
import type { IPactInt } from '@kadena/types';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import {
  formatAdditionalSigners,
  formatCapabilities,
} from '../integration-tests/support/helpers';
import type {
  CommonProps,
  ICreateTokenPolicyConfig,
  PolicyProps,
  WithCreateTokenPolicy,
} from './config';
import { validatePolicies } from './helpers';

interface ICreateTokenInput extends CommonProps {
  policies?: string[];
  uri: string;
  tokenId: string;
  precision: IPactInt | PactReference;
  chainId: ChainId;
  creator: {
    account: string;
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
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
      data.push(addData('mint_guard', props.guards.mintGuard));
    if (props.guards.burnGuard)
      data.push(addData('burn_guard', props.guards.burnGuard));
    if (props.guards.saleGuard)
      data.push(addData('sale_guard', props.guards.saleGuard));
    if (props.guards.transferGuard)
      data.push(addData('transfer_guard', props.guards.transferGuard));
    if (props.guards.uriGuard)
      data.push(addData('uri_guard', props.guards.uriGuard));
  }

  if (policyConfig?.hasRoyalty) {
    data.push(addData('fungible', props.royalty.fungible));
    data.push(addData('creator', props.royalty.creator));
    data.push(addData('creator-guard', props.royalty.creator.keyset));
    data.push(addData('royalty-rate', props.royalty.royaltyRate.decimal));
  }

  if (policyConfig?.upgradeableURI && !policyConfig?.guarded) {
    if (props.guards.uriGuard)
      data.push(addData('uri_guard', props.guards.uriGuard));
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
  additionalSigners,
  ...policyProps
}: WithCreateTokenPolicy<C, ICreateTokenInput>) => {
  validatePolicies(policyConfig as ICreateTokenPolicyConfig, policies);
  return composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['create-token'](
        tokenId,
        precision,
        uri,
        policies.length > 0
          ? ([policies.join(' ')] as unknown as PactReference)
          : ([] as unknown as PactReference),
        readKeyset('creation-guard'),
      ),
    ),
    addKeyset('creation-guard', creator.keyset.pred, ...creator.keyset.keys),
    addSigner(creator.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor('marmalade-v2.ledger.CREATE-TOKEN', tokenId, creator.keyset),

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
};

export const createToken = <C extends ICreateTokenPolicyConfig>(
  inputs: WithCreateTokenPolicy<C, ICreateTokenInput>,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['create-token']>
  >(config)(createTokenCommand(inputs));
