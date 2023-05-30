export type KAccount = `k:${string}` | string;
export type Decimal = `${number}.${number}`;
type GasCapability = {
	name: 'coin.GAS';
	args: [];
	signer: string;
};
type TransferCapability = {
	name: 'coin.TRANSFER';
	args: [KAccount, KAccount, number];
	signer: string;
};

export type Capabilities = {
	Gas: GasCapability;
	Transfer: TransferCapability;
};

export type TransactionPayload = {
	command: `(coin.transfer "${KAccount}" "${KAccount}" ${Decimal})`;
	caps: [TransferCapability];
	data: any;
};

export const decimalFormatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 1,
	maximumFractionDigits: 12,
});

export const setTransactionCommand =
	(from: KAccount, to: KAccount, amount: number) =>
	<T extends Partial<TransactionPayload>>(payload: T): T => {
		return {
			...payload,
			command: `(coin.transfer "${from}" "${to}" ${decimalFormatter.format(
				amount,
			)})`,
		};
	};
