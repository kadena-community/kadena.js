/**
 * @alpha
 */
export interface IQuickSignRequestBody {
  cmdSigDatas: IUnsignedQuicksignTransaction[];
}

/**
 * @alpha
 */
export interface IQuicksignSigner {
  pubKey: string;
  sig: IQuicksignSig;
}

/**
 * @alpha
 */
export interface IUnsignedQuicksignTransaction {
  sigs: IQuicksignSigner[];
  cmd: string;
}

/**
 * @alpha
 */
// eslint-disable-next-line @rushstack/no-new-null
export type IQuicksignSig = string | null;

/**
 * @alpha
 */
export interface IQuicksignResponse {
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
}

/**
 * @alpha
 */
export interface IQuicksignError {
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
 * @alpha
 */
export interface IQuicksignResponseCommand {
  sigs: IQuicksignSigner[];
  cmd: string;
}
