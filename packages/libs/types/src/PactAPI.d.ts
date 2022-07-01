import type { Base64Url } from './Base64Url';
import type { ChainwebChainId, Command, CommandResult } from './PactCommand';

// TODO: Add descriptions
export type RequestKeys = {
  requestKeys: Array<Base64Url>;
};

/**
 * Request type of /send endpoint.
 *
 * @param cmds - Non-empty array of Pact commands (or transactions) to submit to server.
 */
export type SendRequestBody = {
  cmds: Array<Command>;
};

/**
 * Response type of /send endpoint.
 *
 * @param requestKeys - List of request keys (or command hashes) of the transactions submitted.
 *                      Can be sent to /poll and /listen to retrieve transaction results.
 */
export type SendResponse = RequestKeys;

export type LocalRequestBody = Command;
export type LocalResponse = CommandResult;

/**
 * Request type of /poll endpoint.
 *
 * @param requestKeys - List of request keys (or command hashes) to poll for.
 */
export type PollRequestBody = {
  requestKeys: Array<Base64Url>;
};

export type PollResponse = {
  [key: Base64Url]: CommandResult;
};

/**
 * Request type of /listen endpoint.
 *
 * @param listen - Single request key (or command hash) to listen for.
 */
export type ListenRequestBody = {
  listen: Base64Url;
};

export type ListenResponse = CommandResult;

/**
 * Request type of /spv endpoint.
 *
 * @param requestKey - Request Key of an initiated cross chain transaction at the source chain.
 * @param targetChainId - Target chain id of the cross chain transaction.
 */
export type SPVRequestBody = {
  requestKey: Base64Url;
  targetChainId: ChainwebChainId;
};

/**
 * Response type of /spv endpoint.
 *
 * Returns backend-specific data for continuing a cross-chain proof.
 *
 */
export type SPVResponse = SPVProof;
