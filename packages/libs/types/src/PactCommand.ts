import type { Base16String } from './Base16String';
import type { IBase64Url } from './Base64Url';
import type { PactValue } from './PactValue';
/**
 * A Chainweb transaction payload that executes arbitraty Pact code.
 *
 * @param code - Pact code to be executed.
 * @param data - Arbitrary JSON to be accessed in Pact code via `read-msg`, `read-integer`, ect.
 *               Required field, but if not applicable set to 'null'.
 * @alpha
 */
export interface IExecPayload {
  /* eslint-disable-next-line @rushstack/no-new-null */
  data: Exclude<EnvData, undefined> | null;
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
 * @alpha
 */
export interface IContPayload {
  pactId: PactTransactionHash;
  step: Step;
  rollback: Rollback;
  /* eslint-disable-next-line @rushstack/no-new-null */
  data: Exclude<EnvData, undefined> | null;
  /* eslint-disable-next-line @rushstack/no-new-null */
  proof: Exclude<Proof, undefined> | null;
}

/**
 * The different Pact transaction types that can be sent to Chainweb.
 * @alpha
 */
export type PactPayload = { exec: IExecPayload } | { cont: IContPayload };

/**
 * A Pact capability to be signed and brought into scope during Pact execution.
 *
 * @param name - Qualified name of the capability. For example:
 *    - "<namespace>.<moduleName>.<capabilityName>"
 *    - "<moduleName>.<capabilityName>"
 * @param args - An array of PactValue arguments the capability expects.
 * @alpha
 */
export interface ICap {
  name: string;
  args: Array<PactValue>;
}

/**
 * Pact supports multiple signing schemas. The default is ED25519.
 * ETH is also supported.
 * This type is used to specify which schema to use.
 *
 * @alpha
 */
export type SignerScheme = 'ED25519';

/**
 * Information on the cryptographic signer authenticating a Chainweb transaction.
 *
 * @param scheme - The cryptographic signature scheme used. Defaults to "ED25519". "ETH" is also supported.
 * @param pubKey - The Public Key of the signing key pair.
 * @param addr - String derived from the public key. Defaults to equal the value of `pubKey`.
 * @param clist - List of Pact capabilities associated with/installed by this signer.
 * @alpha
 */
export interface ISigner {
  pubKey: Base16String;
  scheme?: SignerScheme;
  addr?: Base16String;
  clist?: Array<ICap>;
}

/**
 * Metadata necessary for sending transactions to Chainweb.
 *
 * @param creationTime - Time transaction sent in POSIX epoch format.
 * @param ttl - Time in seconds after the creation time that the transaction can be executed.
 *              Valid range: [ 1 .. 180000 ] seconds.
 * @param gasLimit - Maximum amount of gas units that can be consumed during transaction execution.
 * @param gasPrice - Specifies price per gas unit to be charged. Must be \>= 1.
 * @param sender - Indicates the gas-paying account in Chainweb.
 * @param chainId - Platform-specific chain identifier.
 * @alpha
 */
export interface IMetaData {
  creationTime: number;
  ttl: number;
  gasLimit: number;
  gasPrice: number;
  sender: string;
  chainId: ChainId;
}

// TODO : Add descriptions
/**
 * @alpha
 */
export type PactTransactionHash = IBase64Url;
/**
 * @alpha
 */
export type PactCode = string;
/**
 * @alpha
 */
export type Nonce = string;
/**
 * @alpha
 */
export type EnvData = Record<string, unknown> | undefined;
/**
 * @alpha
 */
export type Step = number;
/**
 * @alpha
 */
export type Rollback = boolean;
/**
 * @alpha
 */
export type Proof = IBase64Url | undefined;
/**
 * @alpha
 */
export type NetworkId = string | undefined;
/**
 * @alpha
 */
export type ChainId =
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
 * The full transaction payload to be signed and sent to Chainweb.
 *
 * @param networkId - Backend-specific identifier of target network.
 * @param payload - Pact code to execute during transaction.
 * @param signers - List of signers, corresponding with list of signatures in outer command.
 * @param meta - Platform-specific metadata.
 * @param nonce - Arbitrary user-supplied value (often a timestamp).
 * @alpha
 */
export interface ICommandPayload {
  /* eslint-disable-next-line @rushstack/no-new-null */
  networkId: Exclude<NetworkId, undefined> | null;
  payload: PactPayload;
  signers: Array<ISigner>;
  meta: IMetaData;
  nonce: string;
}

/**
 * @alpha
 */
export type CommandPayloadStringifiedJSON = string;

/**
 * @alpha
 */
export interface IUserSig {
  sig: Base16String;
}

/**
 * @alpha
 */
export interface ISignatureJson {
  sig: string;
  pubKey?: string;
}

// TODO: function for gettig from ICommandPayload-> CommandPayloadStringifiedJSON
// TODO: Change file name to just 'Command.ts'.

/**
 * The full transaction, its hash, and its signatures.
 * Used to submit dry-run (/local) or permanent (/send) transactions to Chainweb.
 *
 * @param cmd - Stringified JSON of a ICommandPayloadobject. The canonic, non-malleable signed transaction data.
 * @param hash - The Blake2s-256 hash of the `cmd` field value. Serves as a command's requestKey since each transaction must be unique.
 * @param sigs - List of signatures corresponding one-to-one with the `signers` array in the CommandPayload.
 * @alpha
 */
export interface ICommand {
  cmd: CommandPayloadStringifiedJSON;
  hash: PactTransactionHash;
  sigs: Array<ISignatureJson>;
}

/**
 * @alpha
 */
export interface IUnsignedCommand {
  cmd: CommandPayloadStringifiedJSON;
  hash: PactTransactionHash;
  sigs: Array<ISignatureJson | { pubKey: string; sig?: string } | undefined>;
}

/**
 *  Backend-specific data for continuing a cross-chain proof.
 *
 * @alpha
 */
export type SPVProof = string;

/**
 * Describes result of a defpact execution.
 *
 * @alpha
 */
// @TODO Add nested pacts to OpenApi specs?
// @TODO Is the `yield.data` type correctly defined?
export interface IPactExec {
  /**
   * Identifies this defpact execution. Generated after the first step and matches the request key of the transaction.
   * @alpha
   */
  pactId: PactTransactionHash;
  /**
   *  Identifies which step executed in defpact.
   * @alpha
   */
  step: Step;
  /**
   *  Total number of steps in pact.
   * @alpha
   */
  stepCount: number;
  /**
   *  Optional value for private pacts, indicates if step was skipped.
   * @alpha
   */
  /* eslint-disable-next-line @rushstack/no-new-null */
  executed: boolean | null;
  /**
   *  Indicates if pact step has rollback.
   * @alpha
   */
  stepHasRollback: boolean;
  /**
   *  Closure describing executed pact.
   * @alpha
   */
  continuation: {
    /**
     *  Fully-qualified defpact name.
     * @alpha
     */
    def: string;
    /**
     *  Arguments used with defpact.
     * @alpha
     */
    args: PactValue;
  };
  /**
   *  Value yielded during pact step, optionally indicating cross-chain execution.
   * @alpha
   */
  yield: {
    /**
     *  Pact value object containing yielded data.
     * @alpha
     */
    data: Array<[string, PactValue]>;
    /**
     *  yield.provenance
     * @alpha
     */
    provenance: {
      /**
       * Chain ID of target chain for next step.
       * @alpha
       */
      targetChainId: ChainId;
      /**
       * Hash of module executing defpact.
       * @alpha
       */
      moduleHash: string;
      /* eslint-disable-next-line @rushstack/no-new-null */
    } | null;
    /* eslint-disable-next-line @rushstack/no-new-null */
  } | null;
}

/**
 * Events emitted during Pact execution.
 *
 * @param name - Event defcap name.
 * @param module - Qualified module name of event defcap.
 * @param params - defcap arguments.
 * @param moduleHash - Hash of emitting module.
 *
 * @alpha
 */
export interface IPactEvent {
  name: string;
  module: {
    name: string;
    /* eslint-disable-next-line @rushstack/no-new-null */
    namespace: string | null;
  };
  params: Array<PactValue>;
  moduleHash: string;
}
