import type {
  ChainwebChainId,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import {
  faucetGasStation,
  sender00Account,
} from '../../../constants/accounts.constants';
import { InitialFunding } from '../../../constants/amounts.constants';
import { transferFunds } from '../../../helpers/client-utils/transfer.helper';

export const fundGasStation = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}): Promise<ICommandResult> => {
  const transfer = await transferFunds(
    sender00Account,
    faucetGasStation,
    InitialFunding,
    chainId,
  );
  return transfer;
};
