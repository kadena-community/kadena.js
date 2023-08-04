/**
 * Interface for the {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 * @public
 */
export interface IQuickSignRequestBody {
  cmdSigDatas: IUnsignedQuicksignTransaction[];
}

/**
 * `cmdSigData` in {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 * @public
 */
export interface IUnsignedQuicksignTransaction {
  sigs: IQuicksignSigner[];
  cmd: string;
}

/**
 * `sigs` in {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 * @public
 */
export interface IQuicksignSigner {
  pubKey: string;
  sig: IQuicksignSig;
}

/**
 * `sig` in {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 * @public
 */
// eslint-disable-next-line @rushstack/no-new-null
export type IQuicksignSig = string | null;

/**
 * Response from {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 * @public
 */
export type IQuicksignResponse =
  | IQuicksignResponseError
  | IQuicksignResponseOutcomes;

/**
 * Succesful result from {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 * @public
 */
export interface IQuicksignResponseOutcomes {
  responses: {
    commandSigData: IQuicksignResponseCommand;
    outcome:
      | {
          hash: string;
          result: 'success';
        }
      | {
          msg: string;
          result: 'failure';
        }
      | {
          result: 'noSig';
        };
  }[];
}

/**
 * Error response from {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 * @public
 */
export interface IQuicksignResponseError {
  error:
    | {
        type: 'reject';
      }
    | {
        type: 'emptyList';
      }
    | {
        type: 'other';
        msg: string;
      };
}

/**
 * response `commandSigData` in {@link IQuicksignResponseOutcomes}
 * @public
 */
export interface IQuicksignResponseCommand {
  sigs: IQuicksignSigner[];
  cmd: string;
}
