import { Reducer } from './pact.js';

export type KAccount = string;
export type Decimal = `${number}.${number}`;
interface IGasCapability {
  name: 'coin.GAS';
  args: [];
  signer: string;
}
interface ITransferCapability {
  name: 'coin.TRANSFER';
  args: [KAccount, KAccount, number];
  signer: string;
}

export interface ICapabilities {
  Gas: IGasCapability;
  Transfer: ITransferCapability;
}

export interface ITransactionPayload {
  command: `(coin.transfer "${KAccount}" "${KAccount}" ${Decimal})`;
  caps: [ITransferCapability];
  data: unknown;
}

export const decimalFormatter: Intl.NumberFormat = new Intl.NumberFormat(
  'en-US',
  {
    minimumFractionDigits: 1,
    maximumFractionDigits: 12,
    useGrouping: false,
  },
);

export const setTransferCreateCommand =
  (from: KAccount, to: KAccount, toKs: string, amount: number): Reducer =>
  async (payload) => {
    return {
      ...(await payload),
      command: `(coin.transfer-create "${from}" "${to}" (read-keyset '${toKs}) ${decimalFormatter.format(
        amount,
      )})`,
    };
  };
export const setTransactionCommand =
  (from: KAccount, to: KAccount, amount: number): Reducer =>
  async (payload) => {
    return {
      ...(await payload),
      command: `(coin.transfer "${from}" "${to}" ${decimalFormatter.format(
        amount,
      )})`,
    };
  };
