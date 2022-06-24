import { PactValue } from './PactValue';
import { Base64Url } from './Base64Url';
import { Base16String } from './Base16String';

/**
 * A Chainweb transaction payload that executes arbitraty Pact code.
 *
 * @param code - Pact code to be executed.
 * @param data - Arbitrary JSON to be accessed in Pact code via `read-msg`, `read-integer`, ect.
 *               Required field, but if not applicable set to 'null'.
 */
export interface Exec {
  data: object | null;
  code: string;
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
  pactId: Base64Url;
  step: number;
  rollback: boolean;
  data: object | null;
  proof: Base64Url | null;
}

/**
 * The different Pact transaction types that can be sent to Chainweb.
 */
export type PactPayload =
  | { exec: Exec }
  | { cont: Cont };

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
  clist?: [Cap];
}

/**
 * Stringified Chainweb chain numbers.
 */
export type ChainwebChainId = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19';

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
export interface ChainwebMetaData {
  creationTime: number;
  ttl: number;
  gasLimit: number;
  gasPrice: number;
  sender: string;
  chainId: ChainwebChainId;
}

/**
 * Different Chainweb network versions.
 */
export type ChainwebNetworkId = 'mainnet01' | 'testnet04' | 'devnet';

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
  networkId: ChainwebNetworkId | null;
  payload: PactPayload;
  signers: [Signer];
  meta: ChainwebMetaData;
  nonce: string;
}

export type CommandPayloadStringifiedJSON = string;

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
  hash: Base64Url;
  sigs: [Base16String];
}
