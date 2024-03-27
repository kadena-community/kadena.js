interface IRoyaltyInfoInput {
  fungible: string;
  creator: string;
  creatorGuard: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  royaltyRate: IPactDecimal;
}

interface IGuardInfoInput {
  mintGuard?: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  uriGuard?: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  saleGuard?: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  burnGuard?: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  transferGuard?: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
}

interface IGuardInfoInput {
  mintGuard?: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  uriGuard?: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  saleGuard?: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  burnGuard?: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  transferGuard?: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
}

interface ICollectionInfoInput {
  collectionName:string
  collectionSize:integer
  operatorGuard: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
}

interface IPolicyConfig {
  upgradeableURI:boolean; // enforce guard-policy and add uri guard
  mintProtected:boolean; // enforce guard-policy and mint guard
  nonFungible:boolean; // enforce non-fungible-policy
  royaltyProtected:boolean; // enforce royalty-policy and add royalty-spec
  collection:boolean; // enforce collection-policy and add collection-id.
}
