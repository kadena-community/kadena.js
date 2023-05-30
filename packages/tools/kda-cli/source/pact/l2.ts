import * as coin from './coin.js';
type Decimal = `${number}.${number}`;
type GasCapability = {
	name: 'n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.gas-station.GAS_PAYER';
	args: [string, {int: number}, number];
	signer: string;
};

type TransferCapability = {
	name: 'n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.TRANSFER';
	args: [string, string, number];
	signer: string;
};

type WithdrawCapability = {
	name: 'n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.WITHDRAW';
	args: [string, string, number];
	signer: string;
};

export type Capabilities = {
	Gas: GasCapability;
	Transfer: TransferCapability;
	Withdraw: WithdrawCapability;
};

export type TransactionPayload = {
	command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.transfer "${string}" "${string}" ${Decimal})`;
	caps: [TransferCapability, coin.Capabilities['Gas'], GasCapability];
	data: any;
};

export type DepositPayload = {
	command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.deposit "${string}" "${string}" ${Decimal})`;
	caps: [
		coin.Capabilities['Transfer'],
		coin.Capabilities['Gas'],
		GasCapability,
	];
	data: any;
};

export type WithdrawPayload = {
	command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.deposit "${string}" "${string}" ${Decimal})`;
	caps: [WithdrawCapability, coin.Capabilities['Gas'], GasCapability];
	data: any;
};
export const decimalFormatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 1,
	maximumFractionDigits: 12,
});

export const setTransactionCommand =
	(from: string, to: string, amount: number) =>
	<T extends Partial<TransactionPayload>>(payload: T): T => {
		return {
			...payload,
			command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.transfer "${from}" "${to}" ${decimalFormatter.format(
				amount,
			)})`,
		};
	};

export const setDepositCommand =
	(from: string, to: string, keysetName: string, amount: number) =>
	<T extends Partial<DepositPayload>>(payload: T): T => {
		return {
			...payload,
			command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.deposit "${from}" "${to}" (read-keyset '${keysetName}) ${decimalFormatter.format(
				amount,
			)})`,
		};
	};

export const setWithdrawCommand =
	(from: string, to: string, amount: number) =>
	<T extends Partial<WithdrawPayload>>(payload: T): T => {
		return {
			...payload,
			command: `(n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9.l2.withdraw "${from}" "${to}" ${decimalFormatter.format(
				amount,
			)})`,
		};
	};
