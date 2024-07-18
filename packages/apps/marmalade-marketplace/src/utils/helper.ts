import { ICreateTokenPolicyConfig, CommonProps } from "@kadena/client-utils/marmalade";
import { BuiltInPredicate } from "@kadena/client";
import { PactNumber } from "@kadena/pactjs";
import { env } from '@/utils/env';

export const getPolicies = (policyConfig: ICreateTokenPolicyConfig) => {
    const policyMap: { [key: string]: string } = {
      nonUpdatableURI: "marmalade-v2.non-updatable-uri-policy-v1",
      customPolicies: "",
      guarded: "marmalade-v2.guard-policy-v1",
      nonFungible: "marmalade-v2.non-fungible-policy-v1",
      hasRoyalty: "marmalade-v2.royalty-policy-v1",
      collection: "marmalade-v2.collection-policy-v1",
    };

    return Object.entries(policyConfig)
      .filter(([key, value]) => value && policyMap[key] )
      .map(([key]) => policyMap[key]);
  };

  type PolicyMapType = {
    [key: string]: string;
  };

  export const formatGuardInput = (guardInput: { uriGuard: string; burnGuard: string; mintGuard: string; saleGuard: string; transferGuard: string }) => {
    const filteredGuardInput = Object.fromEntries(
      Object.entries(guardInput).filter(([key, value]) => value !== '[EXCLUDED]')
    );

    return {
      ...(filteredGuardInput.uriGuard && { uriGuard: formatKeyset(filteredGuardInput.uriGuard) }),
      ...(filteredGuardInput.burnGuard && { burnGuard: formatKeyset(filteredGuardInput.burnGuard) }),
      ...(filteredGuardInput.mintGuard && { mintGuard: formatKeyset(filteredGuardInput.mintGuard) }),
      ...(filteredGuardInput.saleGuard && { saleGuard: formatKeyset(filteredGuardInput.saleGuard) }),
      ...(filteredGuardInput.transferGuard && { transferGuard: formatKeyset(filteredGuardInput.transferGuard) }),
    };
  };

 export const createPrecision = (n: number) => {
    return new PactNumber(n.toString()).toPactInteger();
  };

 export const formatRoyaltyInput = ( royaltyInput: { royaltyFungible: string; royaltyCreator: string; royaltyGuard: string; royaltyRate: string }) => {
    return {
      fungible: {
        refName: {
          name: royaltyInput.royaltyFungible,
          namespace: null,
        },
        refSpec: [
          {
            name: "fungible-v2",
            namespace: null,
          },
        ],
      },
      creator: {
        account: royaltyInput.royaltyCreator,
        keyset: {
          keys: [royaltyInput.royaltyGuard],
          pred: 'keys-all',
        },
      },
      royaltyRate: {"decimal": royaltyInput.royaltyRate},
    };
  };

  export const formatKeyset = (key: string) => ({
    keys: [key],
    pred: 'keys-all' as BuiltInPredicate,
  });

  export const formatAccount = (account: string, key: string) => ({
    account,
    keyset: {
      keys: [key],
      pred: 'keys-all' as BuiltInPredicate,
    },
  });

  export const generateSpireKeyGasCapability = (account:string): CommonProps['capabilities'] => {
    const capabilities:CommonProps['capabilities'] = [];
    capabilities.push({name: `${env.WEBAUTHN_WALLET}.GAS_PAYER`, props: [account, new PactNumber(0).toPactInteger(), new PactNumber(0).toPactDecimal() ]});
    capabilities.push({name: `${env.WEBAUTHN_WALLET}.GAS`, props: [account]});
    return capabilities;
  };

  interface RefSpec {
    namespace: string;
    name: string;
  }

  export interface Policy {
    refSpec: RefSpec[];
    refName: RefSpec;
  }


  export const checkPolicies = (policies: Policy[]): ICreateTokenPolicyConfig => {
    const result: ICreateTokenPolicyConfig = {};

    policies.forEach(policy => {
      if (policy.refName.name === 'guard-policy-v1') {
        result.guarded = true;
      }
      if (policy.refName.name === 'non-fungible-policy-v1') {
        result.nonFungible = true;
      }
    });

    return result;
  };
