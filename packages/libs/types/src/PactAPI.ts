import type { IBase64Url } from './Base64Url';
import type {
  ChainId,
  ICommand,
  ICommandResult,
  SPVProof,
} from './PactCommand';

// TODO: Add descriptions
/**
 * @alpha
 */
export interface IRequestKeys {
  requestKeys: Array<IBase64Url>;
}

/**
 * Request type of /send endpoint.
 *
 * @param cmds - Non-empty array of Pact commands (or transactions) to submit to server.
 * @alpha
 */
export interface ISendRequestBody {
  cmds: Array<ICommand>;
}

/**
 * Response type of /send endpoint.
 *
 * @param requestKeys - List of request keys (or command hashes) of the transactions submitted.
 *                      Can be sent to /poll and /listen to retrieve transaction results.
 *
 * @alpha
 */
export type SendResponse = IRequestKeys;
/**
 * @alpha
 */
export type LocalRequestBody = ICommand;
/**
 * @alpha
 */
export type LocalResponse = ICommandResult;

/**
 * Request type of /poll endpoint.
 *
 * @param requestKeys - List of request keys (or command hashes) to poll for.
 *
 * @alpha
 */
export interface IPollRequestBody {
  requestKeys: Array<IBase64Url>;
}

/**
 * @alpha
 */
export interface IPollResponse {
  [key: IBase64Url]: ICommandResult;
}

/**
 * Request type of /listen endpoint.
 *
 * @param listen - Single request key (or command hash) to listen for.
 *
 * @alpha
 */
export interface IListenRequestBody {
  listen: IBase64Url;
}

/**
 * @alpha
 */
export type ListenResponse = ICommandResult;

/**
 * Request type of /spv endpoint.
 *
 * @param requestKey - Request Key of an initiated cross chain transaction at the source chain.
 * @param targetChainId - Target chain id of the cross chain transaction.
 *
 * @alpha
 */
export interface ISPVRequestBody {
  requestKey: IBase64Url;
  targetChainId: ChainId;
}

/**
 * Response type of /spv endpoint.
 *
 * Returns backend-specific data for continuing a cross-chain proof.
 *
 * @alpha
 */
export type SPVResponse = SPVProof;
