import { getModule, ICapabilityItem } from '../pact';

interface ITransferCapability {
  (name: 'coin.GAS'): ICapabilityItem;
  (
    name: 'coin.TRANSFER',
    from: string,
    to: string,
    amount: number,
  ): ICapabilityItem;
}

interface ITransfer_Crosschain_Capability {
  (name: 'coin.GAS'): ICapabilityItem;
  (
    name: 'coin.TRANSFER_XCHAIN',
    sender: string,
    receiver: string,
    amount: { decimal: string },
  ): ICapabilityItem;
  (name: 'coin.CREDIT', receiver: string): ICapabilityItem;
}

interface IAdminCapability {
  (name: 'test.ADMIN'): ICapabilityItem;
}

export interface ICoin {
  transfer: (
    from: string,
    to: string,
    amount: { decimal: string },
  ) => string & {
    capability: ITransferCapability;
  };
  'transfer-crosschain': (
    sender: string,
    receiver: string,
    receiverGuard: string,
    targetChain: string,
    amount: { decimal: string },
  ) => string & {
    capability: ITransfer_Crosschain_Capability;
  };
}

export const coin: ICoin = getModule('coin');
