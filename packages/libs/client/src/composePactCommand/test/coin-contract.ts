import type { ICap } from '@kadena/types';

interface ITransferCapability {
  (name: 'coin.GAS'): ICap;
  (
    name: 'coin.TRANSFER',
    from: string,
    to: string,
    amount: { decimal: string },
  ): ICap;
}

interface ITransferCrosschainCapability {
  (name: 'coin.GAS'): ICap;
  (
    name: 'coin.TRANSFER_XCHAIN',
    sender: string,
    receiver: string,
    amount: { decimal: string },
  ): ICap;
  (name: 'coin.CREDIT', receiver: string): ICap;
}

export interface ICoin {
  transfer: (
    from: string,
    to: string,
    amount: { decimal: string },
  ) => string & {
    capability: ITransferCapability;
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'transfer-crosschain': (
    sender: string,
    receiver: string,
    receiverGuard: string,
    targetChain: string,
    amount: { decimal: string },
  ) => string & {
    capability: ITransferCrosschainCapability;
  };
}
