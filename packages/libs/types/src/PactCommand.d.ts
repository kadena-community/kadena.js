import type { Base16String } from './Base16String';
import type { Base64Url } from './Base64Url';
import type { PactValue } from './PactValue';
import type { Signature } from './SignCommand';
/**
 * A Chainweb transaction payload that executes arbitraty Pact code.
 *
 * @param code - Pact code to be executed.
 * @param data - Arbitrary JSON to be accessed in Pact code via `read-msg`, `read-integer`, ect.
 *               Required field, but if not applicable set to 'null'.
 */
export interface Exec {
  data: EnvData;
  code: PactCode;
}

/**
 * A Chainweb transaction payload that continues or rolls back `defpacts`, or multistep transactions.
 *
 * @param pactId - The id of the `defpact` to be continued or rolled back.
 *                 The id is equivalent to the request key (payload hash) of the transaction that
 *                 executed the first step of the `defpact`.
 * @param proof - Backend-specific data for continuing a cross-chain proof.
 *                Required field, but if not applicable set to 'null'.
 * @param rollback - Whether to execute a specified rollback on this step.
 * @param step - Step in the defpact to execute.
 * @param data - Arbitrary JSON to be accessed in Pact code via `read-msg`, `read-integer`, ect.
 *               Required field, but if not applicable set to 'null'.
 */
export interface Cont {
  pactId: PactTransactionHash;
  step: Step;
  rollback: Rollback;
  data: EnvData;
  proof: Proof;
}

/**
 * The different Pact transaction types that can be sent to Chainweb.
 */
export type PactPayload = { exec: Exec } | { cont: Cont };

/**
 * A Pact capability to be signed and brought into scope during Pact execution.
 *
 * @param name - Qualified name of the capability. For example:
 *    - "<namespace>.<moduleName>.<capabilityName>"
 *    - "<moduleName>.<capabilityName>"
 * @param args - An array of PactValue arguments the capability expects.
 */
export type Cap = {
  name: string;
  args: Array<PactValue>;
};

export type SignerScheme = 'ED25519';

/**
 * Information on the cryptographic signer authenticating a Chainweb transaction.
 *
 * @param scheme - The cryptographic signature scheme used. Defaults to "ED25519".
 * @param pubKey
 * @param addr - String derived from the public key. Defaults to equal the value of `pubKey`.
 * @param clist - List of Pact capabilities associated with/installed by this signer.
 */
export interface Signer {
  pubKey: Base16String;
  scheme?: SignerScheme;
  addr?: Base16String;
  clist?: Array<Cap>;
}

/**
 * Metadata necessary for sending transactions to Chainweb.
 *
 * @param creationTime - Time transaction sent in POSIX epoch format.
 * @param ttl - Time in seconds after the creation time that the transaction can be executed.
 *              Valid range: [ 1 .. 180000 ] seconds.
 * @param gasLimit - Maximum amount of gas units that can be consumed during transaction execution.
 * @param gasPrice - Specifies price per gas unit to be charged. Must be >= 1.
 * @param sender - Indicates the gas-paying account in Chainweb.
 * @param chainId - Platform-specific chain identifier.
 */
export interface MetaData {
  creationTime: number;
  ttl: number;
  gasLimit: number;
  gasPrice: number;
  sender: string;
  chainId: ChainId;
}

// TODO : Add descriptions
export type PactTransactionHash = Base64Url;
export type PactCode = string;
export type Nonce = string;
export type EnvData = Record<string, unknown> | null;
export type Step = number;
export type Rollback = boolean;
export type Proof = Base64Url | null;
export type NetworkId = string | null;
export type ChainId = string;

/**
 * The full transaction payload to be signed and sent to Chainweb.
 *
 * @param networkId - Backend-specific identifier of target network.
 * @param payload - Pact code to execute during transaction.
 * @param signers - List of signers, corresponding with list of signatures in outer command.
 * @param meta - Platform-specific metadata.
 * @param nonce - Arbitrary user-supplied value (often a timestamp).
 */
export interface CommandPayload {
  networkId: NetworkId | null;
  payload: PactPayload;
  signers: Array<Signer>;
  meta: MetaData;
  nonce: string;
}

export type CommandPayloadStringifiedJSON = string;

export interface UserSig {
  sig: Base16String;
}

// TODO: function for gettig from CommandPayload -> CommandPayloadStringifiedJSON
// TODO: Change file name to just 'Command.ts'.

/**
 * The full transaction, its hash, and its signatures.
 * Used to submit dry-run (/local) or permanent (/send) transactions to Chainweb.
 *
 * @param cmd - Stringified JSON of a CommandPayload object. The canonic, non-malleable signed transaction data.
 * @param hash - The Blake2s-256 hash of the `cmd` field value. Serves as a command's requestKey since each transaction must be unique.
 * @param sigs - List of signatures corresponding one-to-one with the `signers` array in the CommandPayload.
 */
export interface Command {
  cmd: CommandPayloadStringifiedJSON;
  hash: PactTransactionHash;
  sigs: Array<Signature>;
}

type PactResultSuccess = {
  status: 'success';
  data: PactValue;
};

type PactResultError = {
  status: 'failure';
  error: object;
};

/** Backend-specific data for continuing a cross-chain proof. */
export type SPVProof = string;

/**
 * Describes result of a defpact execution.
 *
 * @param pactId - Identifies this defpact execution. Generated after the first step and matches the request key of the transaction.
 * @param step - Identifies which step executed in defpact.
 * @param stepCount - Total number of steps in pact.
 * @param executed - Optional value for private pacts, indicates if step was skipped.
 * @param stepHasRollback - Indicates if pact step has rollback.
 * @param continuation - Closure describing executed pact.
 * @param continuation.def - Fully-qualified defpact name.
 * @param continuation.args - Arguments used with defpact.
 * @param yield - Value yielded during pact step, optionally indicating cross-chain execution.
 * @param yield.data - Pact value object containing yielded data.
 * @param yield.provenance
 * @param yield.provenance.targetChainId - Chain ID of target chain for next step.
 * @param yield.provenance.moduleHash - Hash of module executing defpact.
 *
 * @TODO Add nested pacts to OpenApi specs?
 * @TODO Is the `yield.data` type correctly defined?
 */
type PactExec = {
  pactId: PactTransactionHash;
  step: Step;
  stepCount: number;
  executed: boolean | null;
  stepHasRollback: boolean;
  continuation: {
    def: string;
    args: PactValue;
  };
  yield: {
    data: Array<[string, PactValue]>;
    provenance: {
      targetChainId: ChainId;
      moduleHash: string;
    } | null;
  } | null;
};

/**
 * Events emitted during Pact execution.
 *
 * @param name - Event defcap name.
 * @param module - Qualified module name of event defcap.
 * @param params - defcap arguments.
 * @param moduleHash - Hash of emitting module.
 */
type PactEvent = {
  name: string;
  module: { name: string; namespace: string | null };
  params: Array<PactValue>;
  moduleHash: string;
};

/**
 * Platform-specific information on the block that executed a transaction.
 *
 * @param blockHash - Block hash of the block containing the transaction.
 * @param blockTime - POSIX time when the block was mined.
 * @param blockHeight - Block height of the block.
 * @param prevBlockHash - Parent Block hash of the containing block.
 * @param publicMeta - Platform-specific data provided by the request.
 *
 * @TODO Add `publicMeta` to Open API spec.
 *
 */
type ChainwebResponseMetaData = {
  blockHash: string;
  blockTime: number;
  blockHeight: number;
  prevBlockHash: string;
  publicMeta: MetaData;
};

/**
 * API result of attempting to execute a pact transaction.
 *
 * @param reqKey - Unique ID of a pact transaction, equivalent to the payload hash.
 * @param txId - Database-internal transaction tracking ID.
 *               Absent when transaction was not successful.
 *               Expected to be non-negative 64-bit integers and
 *               are expected to be monotonically increasing.
 * @param result - Pact execution result, either a Pact error or the output (a PactValue) of the last pact expression in the transaction.
 * @param gas - Gas units consummed by the transaction as a 64-bit integer.
 * @param logs - Backend-specific value providing image of database logs.
 * @param continuation - Describes the result of a defpact execution, if one occurred.
 * @param metaData - Platform-specific information on the block that executed the transaction.
 * @param events - Optional list of Pact events emitted during the transaction.
 *
 * @TODO Should `txId` and `gas` be a BigInt since Haskell defines it as int64?
 * @TODO Add `gas` to OpenApi spec?
 *
 */
export interface CommandResult {
  reqKey: Base64Url;
  txId: number | null;
  result: PactResultSuccess | PactResultError;
  gas: number;
  logs: string | null;
  continuation: PactExec | null;
  metaData: ChainwebResponseMetaData | null;
  events?: Array<PactEvent>;
}

// TODO: Move Chainweb Specific Types
/**
 * Stringified Chainweb chain numbers.
 */
export type ChainwebChainId =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19';

/**
 * Different Chainweb network versions.
 */
export type ChainwebNetworkId =
  | 'mainnet01'
  | 'testnet04'
  | 'development'
  | null;
