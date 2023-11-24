import { sender00Account } from "../constants/accounts";

export const getAccountQuery = {
  query:
    'query getAccount($moduleName: String!, $accountName: String!) {\n  account(moduleName: $moduleName, accountName: $accountName) {\n    ...AllAccountFields\n    chainAccounts {\n      ...CoreChainAccountFields\n      guard {\n        keys\n        predicate\n        __typename\n      }\n      __typename\n    }\n    transactions {\n      edges {\n        node {\n          ...CoreTransactionFields\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    transfers {\n      edges {\n        node {\n          ...CoreTransferFields\n          crossChainTransfer {\n            ...CoreTransferFields\n            __typename\n          }\n          transaction {\n            pactId\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AllAccountFields on ModuleAccount {\n  ...CoreAccountFields\n  id\n  totalBalance\n  __typename\n}\n\nfragment CoreAccountFields on ModuleAccount {\n  accountName\n  moduleName\n  __typename\n}\n\nfragment CoreChainAccountFields on ChainModuleAccount {\n  balance\n  chainId\n  __typename\n}\n\nfragment CoreTransactionFields on Transaction {\n  chainId\n  code\n  creationTime\n  height\n  requestKey\n  __typename\n}\n\nfragment CoreTransferFields on Transfer {\n  amount\n  chainId\n  senderAccount\n  height\n  requestKey\n  receiverAccount\n  __typename\n}',
  variables: { moduleName: 'coin', accountName: sender00Account.account },
  operationName: 'getAccount',
  extensions: {},
};
