import { ICreateTokenPolicyConfig } from "@kadena/client-utils/marmalade";
import { ChainId, BuiltInPredicate } from "@kadena/client";
import { PactNumber } from "@kadena/pactjs";

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

    return {
      uriGuard: createKeyset(guardInput.uriGuard),
      burnGuard: createKeyset(guardInput.burnGuard),
      mintGuard: createKeyset(guardInput.mintGuard),
      saleGuard: createKeyset(guardInput.saleGuard),
      transferGuard: createKeyset(guardInput.transferGuard),
    };
  };


 export const createKeyset = (key: string) => {
    return { 
      "keyset": {
        "keys": [key],
        "pred": "keys-all" as BuiltInPredicate
      }}
  };

 export const createAccountKeyset = (key: string) => {
    return { 
      "account": "k:" + key ,
      "keyset": {
        "keys": [key],
        "pred": "keys-all" as BuiltInPredicate
      }}
  };


 export const createPrecision = (n: string) => {
    return new PactNumber(n).toPactInteger();
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
