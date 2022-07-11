/**
 * @alpha
 */
export declare type Base16String = string;

/**
 * @alpha
 */
export declare type ChainId = string;

/**
 * Stringified Chainweb chain numbers.
 * @alpha
 */
export declare type ChainwebChainId = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19';

/**
 * Different Chainweb network versions.
 * @alpha
 */
export declare type ChainwebNetworkId = 'mainnet01' | 'testnet04' | 'development' | undefined;

/**
 * @alpha
 */
export declare type CommandPayloadStringifiedJSON = string;

/**
 * @alpha
 */
export declare type EnvData = Record<string, unknown> | undefined;

/**
 * @alpha
 */
export declare type IBase64Url = string;

/**
 * A Pact capability to be signed and brought into scope during Pact execution.
 *
 * @param name - Qualified name of the capability. For example:
 *    - "<namespace>.<moduleName>.<capabilityName>"
 *    - "<moduleName>.<capabilityName>"
 * @param args - An array of PactValue arguments the capability expects.
 * @alpha
 */
export declare interface ICap {
    name: string;
    args: Array<PactValue>;
}

/**
 * Platform-specific information on the block that executed a transaction.
 *
 * @param blockHash - Block hash of the block containing the transaction.
 * @param blockTime - POSIX time when the block was mined.
 * @param blockHeight - Block height of the block.
 * @param prevBlockHash - Parent Block hash of the containing block.
 * @param publicMeta - Platform-specific data provided by the request.
 *
 *
 */
declare interface IChainwebResponseMetaData {
    blockHash: string;
    blockTime: number;
    blockHeight: number;
    prevBlockHash: string;
    publicMeta?: IMetaData;
}

/**
 * The full transaction, its hash, and its signatures.
 * Used to submit dry-run (/local) or permanent (/send) transactions to Chainweb.
 *
 * @param cmd - Stringified JSON of a ICommandPayloadobject. The canonic, non-malleable signed transaction data.
 * @param hash - The Blake2s-256 hash of the `cmd` field value. Serves as a command's requestKey since each transaction must be unique.
 * @param sigs - List of signatures corresponding one-to-one with the `signers` array in the CommandPayload.
 * @alpha
 */
export declare interface ICommand {
    cmd: CommandPayloadStringifiedJSON;
    hash: PactTransactionHash;
    sigs: Array<ISignature>;
}

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
export declare interface ICommandPayload {
    networkId: Exclude<NetworkId, undefined> | null;
    payload: PactPayload;
    signers: Array<ISigner>;
    meta: IMetaData;
    nonce: string;
}

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
 *
 * @alpha
 */
export declare interface ICommandResult {
    reqKey: IBase64Url;
    txId: number | null;
    result: IPactResultSuccess | IPactResultError;
    gas: number;
    logs: string | null;
    continuation: IPactExec | null;
    metaData: IChainwebResponseMetaData | null;
    events?: Array<IPactEvent>;
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
export declare interface IContPayload {
    pactId: PactTransactionHash;
    step: Step;
    rollback: Rollback;
    data: Exclude<EnvData, undefined> | null;
    proof: Exclude<Proof, undefined> | null;
}

/**
 * A Chainweb transaction payload that executes arbitraty Pact code.
 *
 * @param code - Pact code to be executed.
 * @param data - Arbitrary JSON to be accessed in Pact code via `read-msg`, `read-integer`, ect.
 *               Required field, but if not applicable set to 'null'.
 * @alpha
 */
export declare interface IExecPayload {
    data: Exclude<EnvData, undefined> | null;
    code: PactCode;
}

/**
 * @alpha
 */
export declare interface IKeyPair {
    publicKey: string;
    secretKey?: string;
    clist?: Array<ICap>;
}

/**
 * Request type of /listen endpoint.
 *
 * @param listen - Single request key (or command hash) to listen for.
 *
 * @alpha
 */
export declare interface IListenRequestBody {
    listen: IBase64Url;
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
export declare interface IMetaData {
    creationTime: number;
    ttl: number;
    gasLimit: number;
    gasPrice: number;
    sender: string;
    chainId: ChainId;
}

/**
 * A very big or very small `pact` decimal value.
 * Decimals whose mantissa precision is greater than the max `number` value (9007199254740991)
 * or less than the min `number` value (-9007199254740991) are stringified and tagged as
 * indicated by the `pact` serialization of decimal values:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/Codec.hs#L83
 * @alpha
 */
export declare interface IPactDecimal {
    decimal: string;
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
export declare interface IPactEvent {
    name: string;
    module: {
        name: string;
        namespace: string | null;
    };
    params: Array<PactValue>;
    moduleHash: string;
}

/**
 * Describes result of a defpact execution.
 *
 * @alpha
 */
export declare interface IPactExec {
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
        } | null;
    } | null;
}

/**
 * A very big or very small `pact` integer value.
 * Integers greater than the max `number` value (9007199254740991) or less than
 * the min `number` value (-9007199254740991) are stringified and tagged as
 * indicated by the `pact` serialization of integer values:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/Codec.hs#L64
 * @alpha
 */
export declare interface IPactInt {
    int: string;
}

declare interface IPactResultError {
    status: 'failure';
    error: object;
}

declare interface IPactResultSuccess {
    status: 'success';
    data: PactValue;
}

/**
 * Request type of /poll endpoint.
 *
 * @param requestKeys - List of request keys (or command hashes) to poll for.
 *
 * @alpha
 */
export declare interface IPollRequestBody {
    requestKeys: Array<IBase64Url>;
}

/**
 * @alpha
 */
export declare interface IPollResponse {
    [key: IBase64Url]: ICommandResult;
}

/**
 * @alpha
 */
export declare interface IRequestKeys {
    requestKeys: Array<IBase64Url>;
}

/**
 * Request type of /send endpoint.
 *
 * @param cmds - Non-empty array of Pact commands (or transactions) to submit to server.
 * @alpha
 */
export declare interface ISendRequestBody {
    cmds: Array<ICommand>;
}

/**
 * @alpha
 */
export declare interface ISignature {
    sig: string | undefined;
}

/**
 * @alpha
 */
export declare interface ISignedCommand {
    hash: string;
    sigs: ISignature[];
    cmd: string;
}

/**
 * @alpha
 */
export declare interface ISignedSignatureWithHash extends ISignature {
    hash: string;
    sig: string | undefined;
    pubKey: string;
}

/**
 * Information on the cryptographic signer authenticating a Chainweb transaction.
 *
 * @param scheme - The cryptographic signature scheme used. Defaults to "ED25519".
 * @param pubKey - The Public Key of the signing key pair.
 * @param addr - String derived from the public key. Defaults to equal the value of `pubKey`.
 * @param clist - List of Pact capabilities associated with/installed by this signer.
 * @alpha
 */
export declare interface ISigner {
    pubKey: Base16String;
    scheme?: SignerScheme;
    addr?: Base16String;
    clist?: Array<ICap>;
}

/**
 * Pact capability object with role and description to be consumed in Signing API
 * @param role - role of the capability.
 * @param description - description of the capability.
 * @param ICap - name and arguments of the capability
 * @alpha
 */
export declare interface ISigningCap {
    role: string;
    description: string;
    cap: ICap;
}

/**
 * Request type of /spv endpoint.
 *
 * @param requestKey - Request Key of an initiated cross chain transaction at the source chain.
 * @param targetChainId - Target chain id of the cross chain transaction.
 *
 * @alpha
 */
export declare interface ISPVRequestBody {
    requestKey: IBase64Url;
    targetChainId: ChainId;
}

/**
 * @alpha
 */
export declare interface IUnsignedSignatureWithHash extends ISignature {
    hash: string;
    sig: string | undefined;
    pubKey?: string;
}

/**
 * @alpha
 */
export declare interface IUserSig {
    sig: Base16String;
}

/**
 * @alpha
 */
export declare type ListenResponse = ICommandResult;

/**
 * @alpha
 */
export declare type LocalRequestBody = ICommand;

/**
 * @alpha
 */
export declare type LocalResponse = ICommandResult;

/**
 * @alpha
 */
export declare type NetworkId = string | undefined;

/**
 * @alpha
 */
export declare type Nonce = string;

/**
 * @alpha
 */
export declare type PactCode = string;

/**
 * A sum type representing a `pact` literal value.
 * Should have parity with the JSON serialization of the Haskell type `Literal` as defined in `pact`:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/Exp.hs#L95
 * string
 *
 * `number` - JavaScript integer and decimal values.
 *                      Max `number` value is 9007199254740991.
 *                      Min `number` value is -9007199254740991.
 *
 * `PactInt` - Integer values that exceed the max and min precision of `number`.
 *
 * `PactDecimal` - Decimal values whose mantissa exceed the max and min precision of `number`.
 *
 * `boolean`
 *
 * TODO: add `UTCTime` literal.
 * @alpha
 */
export declare type PactLiteral = string | number | IPactInt | IPactDecimal | boolean;

/**
 * The different Pact transaction types that can be sent to Chainweb.
 * @alpha
 */
export declare type PactPayload = {
    exec: IExecPayload;
} | {
    cont: IContPayload;
};

/**
 * @alpha
 */
export declare type PactTransactionHash = IBase64Url;

/**
 * A sum type representing a `pact` value.
 * Should have parity with the JSON serialization of the Haskell type `PactValue` as defined in `pact`:
 * https://github.com/kadena-io/pact/blob/master/src/Pact/Types/PactValue.hs#L109
 *
 * `PactLiteral` - any `PactLiteral`
 *
 * `Array<PactValue>` - Array of pact values (recursive type)
 *
 * TODO: add object map of pact values type.
 * TODO: add guard type of pact values type.
 * TODO: add module reference type type.
 * @alpha
 */
export declare type PactValue = PactLiteral | Array<PactValue>;

/**
 * @alpha
 */
export declare type Proof = IBase64Url | undefined;

/**
 * @alpha
 */
export declare type Rollback = boolean;

/**
 * Response type of /send endpoint.
 *
 * @param requestKeys - List of request keys (or command hashes) of the transactions submitted.
 *                      Can be sent to /poll and /listen to retrieve transaction results.
 *
 * @alpha
 */
export declare type SendResponse = IRequestKeys;

/**
 * @alpha
 */
export declare type SignatureWithHash = ISignedSignatureWithHash | IUnsignedSignatureWithHash;

/**
 * @alpha
 */
export declare type SignCommand = SignatureWithHash;

/**
 * @alpha
 */
export declare type SignerScheme = 'ED25519';

/**
 *  Backend-specific data for continuing a cross-chain proof.
 *
 * @alpha
 */
export declare type SPVProof = string;

/**
 * Response type of /spv endpoint.
 *
 * Returns backend-specific data for continuing a cross-chain proof.
 *
 * @alpha
 */
export declare type SPVResponse = SPVProof;

/**
 * @alpha
 */
export declare type Step = number;

export { }
