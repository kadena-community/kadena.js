import { KadenaLedger } from './ledger';
import { TransactionParams } from './transaction';

let ledger: KadenaLedger | null = null;

async function getLedger(): Promise<KadenaLedger> {
  if (!ledger) ledger = await KadenaLedger.findDevice();
  return ledger;
}

export async function openApp() {
  const ledger = await getLedger();
  return await ledger.openApp();
}

export async function getPublicKey(index: number) {
  const ledger = await getLedger();
  return await ledger.getPublicKey(index);
}

export async function signTransaction(
  index: number,
  type: 'transfer' | 'cross-chain-transfer',
  params: TransactionParams,
) {
  const ledger = await getLedger();
  return await ledger.signTransaction(index, type, params);
}

export async function getVersion() {
  const ledger = await getLedger();
  return await ledger.getVersion();
}
