import { ISigner } from './IUnsignedTransaction';

/**
 * @alpha
 */
export interface IChainweaverResponse {
  commandSigData: IChainweaverResponseCommand;
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
export interface IChainweaverError {
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
export interface IChainweaverResponseCommand {
  sigs: ISigner[];
  cmd: string;
}
