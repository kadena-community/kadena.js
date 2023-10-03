import type * as coin from './coin.js';
import type { Reducer } from './pact.js';

type Decimal = `${number}.${number}`;
interface IGasCapability {
  name: 'n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.gas-station.GAS_PAYER';
  args: [string, { int: number }, number];
  signer: string;
}

interface ITransferCapability {
  name: 'n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.TRANSFER';
  args: [string, string, number];
  signer: string;
}

interface IWithdrawCapability {
  name: 'n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.WITHDRAW';
  args: [string, string, number];
  signer: string;
}

export interface ICapabilities {
  Gas: IGasCapability;
  Transfer: ITransferCapability;
  Withdraw: IWithdrawCapability;
}

export interface ITransactionPayload {
  command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.transfer "${string}" "${string}" ${Decimal})`;
  caps: [ITransferCapability, coin.ICapabilities['Gas'], IGasCapability];
  data: unknown;
}

export interface IDepositPayload {
  command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.deposit "${string}" "${string}" ${Decimal})`;
  caps: [
    coin.ICapabilities['Transfer'],
    coin.ICapabilities['Gas'],
    IGasCapability,
  ];
  data: unknown;
}

export interface IWithdrawPayload {
  command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.deposit "${string}" "${string}" ${Decimal})`;
  caps: [IWithdrawCapability, coin.ICapabilities['Gas'], IGasCapability];
  data: unknown;
}
export const decimalFormatter: Intl.NumberFormat = new Intl.NumberFormat(
  'en-US',
  {
    minimumFractionDigits: 1,
    maximumFractionDigits: 12,
  },
);

export const setTransactionCommand =
  (from: string, to: string, amount: number): Reducer =>
  async (payload) => {
    return {
      ...(await payload),
      command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.transfer "${from}" "${to}" ${decimalFormatter.format(
        amount,
      )})`,
    };
  };

export const setDepositCommand =
  (from: string, to: string, keysetName: string, amount: number): Reducer =>
  async (payload) => {
    return {
      ...(await payload),
      command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.deposit "${from}" "${to}" (read-keyset '${keysetName}) ${decimalFormatter.format(
        amount,
      )})`,
    };
  };

export const setWithdrawCommand =
  (from: string, to: string, amount: number): Reducer =>
  async (payload) => {
    return {
      ...(await payload),
      command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.withdraw "${from}" "${to}" ${decimalFormatter.format(
        amount,
      )})`,
    };
  };
