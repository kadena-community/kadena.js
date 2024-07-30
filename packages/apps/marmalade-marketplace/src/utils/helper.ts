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

  export const formatGuardInput = (guardInput: { uriGuard: any; burnGuard: any; mintGuard: any; saleGuard: any; transferGuard: any }) => {
    const filteredGuardInput = Object.fromEntries(
      Object.entries(guardInput).filter(([key, value]) => value !== '[EXCLUDED]')
    );

    return {
      ...(filteredGuardInput.uriGuard && { uriGuard: filteredGuardInput.uriGuard }),
      ...(filteredGuardInput.burnGuard && { burnGuard: filteredGuardInput.burnGuard }),
      ...(filteredGuardInput.mintGuard && { mintGuard: filteredGuardInput.mintGuard }),
      ...(filteredGuardInput.saleGuard && { saleGuard: filteredGuardInput.saleGuard }),
      ...(filteredGuardInput.transferGuard && { transferGuard: filteredGuardInput.transferGuard }),
    };
  };

  export const createPrecision = (n: number) => {
    return new PactNumber(n.toString()).toPactInteger();
  };

  export const formatRoyaltyInput = ( royaltyInput: { royaltyFungible: string; royaltyCreator: string; royaltyGuard: any; royaltyRate: string }) => {
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
        keyset: royaltyInput.royaltyGuard,          
      },
      royaltyRate: {"decimal": royaltyInput.royaltyRate},
    };
  };

  export const formatKeyset = (key: string) => ({
    keys: [key],
    pred: 'keys-all' as BuiltInPredicate,
  });

  export const formatAccount = (account: string, guard: any) => ({
    account,
    keyset: guard,
  });

  export const generateSpireKeyGasCapability = (account:string): CommonProps['capabilities'] => {
    const capabilities:CommonProps['capabilities'] = [];    
    capabilities.push({name: 'coin.GAS', props: [account]});
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

  export const checkConcretePolicies = (policies: Policy[]): ICreateTokenPolicyConfig => {
    const result: ICreateTokenPolicyConfig = {};

    policies.forEach(policy => {
      if (policy.refName.name === 'guard-policy-v1') {
        result.guarded = true;
      }
      if (policy.refName.name === 'non-fungible-policy-v1') {
        result.nonFungible = true;
      }
      if (policy.refName.name === 'non-updatable-uri-policy-v1') {
        result.nonUpdatableURI = true;
      }
      if (policy.refName.name === 'collection-policy-v1') {
        result.collection = true;
      }
      if (policy.refName.name === 'royalty-policy-v1') {
        result.hasRoyalty = true;
      }
    });

    return result;
  };

export const isPrecise = (n:number, precision:number):boolean => {
  const length = String(n).split(".")[1] ? String(n).split(".")[1].length : 0;
  return length === precision;
}
