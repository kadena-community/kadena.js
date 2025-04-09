import type { KdaMethodMap as StandardKdaMethodMap } from "@kadena/wallet-adapter-core";

/**
 * Represents a quicksign signature as defined in the quicksign API.
 * The signature is a string if present, or null if no signature is provided.
 *
 * @public
 */
export type IQuicksignSig = string | null;

/**
 * Represents a signer for the quicksign API.
 *
 * Contains the public key and the corresponding signature.
 *
 * @public
 */
export interface IQuicksignSigner {
  pubKey: string;
  sig: IQuicksignSig;
}

/**
 * Represents the command data within a quicksign response.
 *
 * This includes the command string and an array of signers with their signatures.
 *
 * @public
 */
export interface IQuicksignResponseCommand {
  sigs: IQuicksignSigner[];
  cmd: string;
}

/**
 * Represents the outcomes of a successful quicksign API response.
 *
 * Contains an array of response objects where each object includes the command signature data and the outcome.
 *
 * The outcome can be one of:
 * - Success: Contains a hash and a result string 'success'.
 * - Failure: Contains an error message and a result string 'failure'.
 * - No Signature: Indicates that no signature was provided, with a result string 'noSig'.
 *
 * @public
 */
export interface IQuicksignResponseOutcomes {
  responses: {
    commandSigData: IQuicksignResponseCommand;
    outcome:
      | {
          hash: string;
          result: "success";
        }
      | {
          msg: string;
          result: "failure";
        }
      | {
          result: "noSig";
        };
  }[];
}

/**
 * Error response from {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 * @public
 */
export declare interface IQuicksignResponseError {
  error:
    | {
        type: "reject";
      }
    | {
        type: "emptyList";
      }
    | {
        type: "other";
        msg: string;
      };
}

/**
 * Response from {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 * @public
 */
export declare type IQuicksignResponse = IQuicksignResponseError | IQuicksignResponseOutcomes;

/**
 * Represents a raw response from the wallet adapter provider.
 *
 * The response includes a status and an optional message.
 *
 * @public
 */
export type RawRequestResponse = {
  status: "success" | "fail";
  message?: string;
};

/**
 * Represents a raw response containing account information from the provider.
 *
 * The response includes a status, an optional message, and an optional wallet object with account details.
 *
 * @public
 */
export type RawAccountResponse = {
  status: string;
  message?: string;
  wallet?: { account: string; publicKey: string };
};

/**
 * Represents a raw network response from the provider.
 *
 * Contains the network name, unique network identifier, and URL.
 *
 * @public
 */
export type RawNetworkResponse = {
  name: string;
  networkId: string;
  url: string;
};

/**
 * Represents the response from a kadena_checkStatus RPC call.
 *
 * This response includes the status, an optional message, and optionally account details.
 *
 * @public
 */
export interface kadenaCheckStatusRPC {
  /**
   * The status of the checkStatus call.
   */
  status: string;

  message?: string;

  account?: {
    chainId: string;
    account: string;
    publicKey: string;
  };
}

/**
 * Represents a successful quicksign response from Ecko Wallet.
 *
 * In older versions of Ecko Wallet, the response property was named "quickSignData".
 * In newer versions, it is named "responses".
 *
 * @public
 */
type IEckoQuicksignSuccessResponse = {
  status: "success";
} & (
  | {
      /**
       * The quicksign response data for older versions of Ecko Wallet.
       */
      quickSignData: IQuicksignResponseOutcomes["responses"];
    }
  | {
      /**
       * The quicksign response data for newer versions of Ecko Wallet.
       */
      responses: IQuicksignResponseOutcomes["responses"];
    }
);

/**
 * Represents a failed quicksign response from Ecko Wallet.
 *
 * Contains an error code and an optional message.
 *
 * @public
 */
export interface IEckoQuicksignFailResponse {
  status: "fail";
  error: string;
  message?: string;
}

/**
 * Represents the overall quicksign response from Ecko Wallet.
 *
 * It may be either a successful response or a failed response.
 *
 * @public
 */
export type IEckoQuicksignResponse = IEckoQuicksignSuccessResponse | IEckoQuicksignFailResponse;

/**
 * Represents the extended method map specific to Ecko Wallet.
 *
 * Contains custom methods specific to Ecko Wallet, such as a custom checkStatus.
 *
 * @public
 */
export interface EckoMethodMap {
  /**
   * Custom method for checking wallet status.
   *
   * @param params - Optional parameters including networkId.
   * @returns The response from the kadena_checkStatus RPC.
   */
  kadena_checkStatus: {
    params: { networkId?: string };
    response: kadenaCheckStatusRPC;
  };
}

/**
 * ExtendedMethodMap combines the standard KdaMethodMap with Ecko-specific methods.
 *
 * @public
 */
export type ExtendedMethodMap = StandardKdaMethodMap & EckoMethodMap;

/**
 * ExtendedMethod represents the keys of the ExtendedMethodMap.
 *
 * @public
 */
export type ExtendedMethod = keyof ExtendedMethodMap;
