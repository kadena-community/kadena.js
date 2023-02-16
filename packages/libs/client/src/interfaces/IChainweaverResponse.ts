import { ISigner } from 'IUnsignedTransaction';

/**
 * @alpha
 */
export interface IChainweaverResponse {
  commandSigData: IChainweaverResponseCommand;
  outcome: {
    hash: string;
    result: 'success' | 'noSig';
  };
}

/**
 * @alpha
 */
export interface IChainweaverResponseCommand {
  sigs: ISigner[];
  cmd: string;
}
