type SingleText = {
  head: string;
  text: string;
};

export const tooltipTexts: Record<string, SingleText> = {
  pact: {
    head: 'What is Pact code?',
    text: "Pact is Kadena's smart contacts programing language.Type arbitrary pact expressions in the input box below.",
  },
  senderAccount: {
    head: 'What is the Sender Account?',
    text: "Sender Account represents the account name you use to identify yourself in chainweb.You'll be asked to sing with associated to keypairs that can sign its transactions.the simplest way would be to use your public key as your account name",
  },
  capability: {
    head: 'What is a Capability?',
    text: 'In Pact, a capability is a way to scope what the signing keypairs are allowed to perform in code.the default capability is GAS, as all transactions need to have a keypair signing for the gas free.Another standart capability is the TRANSFER capability that requires a user to specify a from-account, to-account, and amount.This means that you are allowing the scoped signature to onlyperform the transfer amount specified.Example: (coin.TRANSFER "from-account" "to-account" 10.0)',
  },
  keyPair: {
    head: 'What is a KeyPair?',
    text: 'A keypair is a composed of a public key and a private key. If you don\'t have a keypair, generate one in the Kadena wallet, or click \'Generate\' for tx\'s  that don\'t require a particular account to sign it. For example, to do a (coin transfer "from"  "to" 1.0 ) you must sign with the keys associated with the transfering account, but to do an account into call such as (coin.detals "nick-cage") you can sign with a dummy key pair as there are no capabilities assosciated with this txdetail',
  },
  signature: {
    head: 'What is a Signature?',
    text: 'This is a safe way to sign your txdetail offline without pasting your private key on the web.Once you fill in all the parameters for your desired txdetail you will be provided a hash that you can copy and sign offline with the Chainweaver wallet or pact cli.You must sign with the corresponding private key of the public key provided',
  },
  chain: {
    head: 'What is Chain ID?',
    text: 'Chain ID is the specific chain within chainweb you are targeting with your txdetail.',
  },
  server: {
    head: 'What is Server?',
    text: 'Server is the Chainweb node you would like to execute the txdetail on',
  },
  version: {
    head: 'What is Version?',
    text: 'This defines what version of Chainweb you are targeting. Mainnet is mainnet01, Testnet is tetnet04',
  },
  sender: {
    head: 'What is Sender?',
    text: 'In the absence of a gas capability, the account specified as sender will be defaulted to the account name that signed the txdetail',
  },
  creationTime: {
    head: 'What is Creation Time?',
    text: 'This specifies that time that your txdetail was created. the default is to use currect time (in seconds)',
  },
  ttl: {
    head: 'What is TTL?',
    text: 'Time to Live for a txdetail. Your txdetail will stay in the mempool for the specified interval between creation time to live (in seconds)',
  },
  gasPrice: {
    head: 'What is Gas Price?',
    text: 'Gas Price is the amount you are willing to pay for each unit of computation on chain. Note that transactions are ordered by miners based on this price, so if you want your txdetail to be included in the next block be generous!! Default is 1e-6',
  },
  gasLimit: {
    head: 'What is Gas Limit?',
    text: 'Gas Limit is the maximum number of computation units you are willing to use. If a transactions takes less gas than specified, you will only be charged how much it effectively takes. Free for a txdetail will be (Gas Price * Gas Limit)',
  },
  keysetName: {
    head: 'What is Keyset Name?',
    text: 'It is the way to refer to the following keyset predicate and public key. For example, the transfer-create functions expects the user to pass in a new keyset to assosciate to and guard the account that is about to be created. The syntax is as follows:(coin.transfer-create "from" "to" (read-keyset "THIS-NAME-JUST-DEFINED")10.0). Here were are telling Pact how to find the newly defined keyset to assosciate to the account to be created. To better understand this advanced section, go to pact.kadena.io create a new keyset name under the date section, assosciate a keypair to it, then go to the result tab)',
  },
  keysetPredicate: {
    head: 'What is Keyset Predicate?',
    text: 'Keyset Predicates allow you to chose which type of signing rules a particular account needs enforce. "keys-all" will require all the keys assosciated to an account to validate a signature. "keys-any" will require only one of the keys assosciated to an account to validate a signature. Note that for single sig account both predicates are the same in practice',
  },
  publicKey: {
    head: 'What is this Public Key?',
    text: 'This is the public key that you are assosicating to the given account. You can assosciate more than one key for each account to allow for milti-sig',
  },
};
