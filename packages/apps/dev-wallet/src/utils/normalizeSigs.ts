import { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { hash } from '@kadena/cryptography-utils';

type SigData = Record<string, string>;
type CommandSigData = Array<{
  pubKey?: string;
  sig?: string;
}>;
type CommandJson = Array<
  | {
      sig?: string;
    }
  | null
  | undefined
>;

type CommandJsonNew = Array<string | null | undefined>;

const sigScheme = (
  sigs: SigData | CommandSigData | CommandJson | CommandJsonNew,
):
  | 'SigData'
  | 'CommandSigData'
  | 'CommandJson'
  | 'CommandJsonNew'
  | 'unknown' => {
  if (Array.isArray(sigs)) {
    if (
      sigs.every((item) => item && typeof item === 'object' && 'pubKey' in item)
    ) {
      return 'CommandSigData';
    }
    if (
      sigs.every(
        (item) =>
          item === null || item === undefined || typeof item === 'string',
      )
    ) {
      return 'CommandJsonNew';
    }
    if (
      sigs.every(
        (item) =>
          item === null ||
          item === undefined ||
          (typeof item === 'object' && 'sig' in item),
      )
    ) {
      return 'CommandJson';
    }
  } else if (typeof sigs === 'object') {
    return 'SigData';
  }
  return 'unknown';
};

export function normalizeSigs(
  tx: IUnsignedCommand,
): Array<{ sig?: string; pubKey: string }> {
  const cmd: IPactCommand = JSON.parse(tx.cmd);
  const scheme = sigScheme(tx.sigs);
  if (scheme === 'SigData') {
    const sigs = tx.sigs as unknown as SigData;
    const normalizedSigs = cmd.signers.map(({ pubKey }) =>
      sigs[pubKey]
        ? {
            sig: sigs[pubKey],
            pubKey,
          }
        : { pubKey },
    );
    return normalizedSigs;
  }
  if (scheme === 'CommandSigData') {
    const sigs = tx.sigs as unknown as CommandSigData;
    const normalizedSigs = cmd.signers.map(({ pubKey }) => {
      const item = sigs.find((s) => s.pubKey === pubKey);
      return item && item.sig ? { sig: item.sig, pubKey } : { pubKey };
    });
    return normalizedSigs;
  }
  if (scheme === 'CommandJsonNew') {
    const sigs = tx.sigs as unknown as CommandJsonNew;
    const normalizedSigs = cmd.signers.map(({ pubKey }, index) => {
      const item = sigs[index];
      return item ? { sig: item, pubKey } : { pubKey };
    });
    return normalizedSigs;
  }
  if (scheme === 'CommandJson') {
    return cmd.signers.map(({ pubKey }, index) => {
      const sig = (tx.sigs as CommandJson)[index]?.sig;
      return sig ? { sig, pubKey } : { pubKey };
    });
  }

  return cmd.signers.map(({ pubKey }) => ({ pubKey }));
}

export const normalizeTx = (tx: IUnsignedCommand) => ({
  ...tx,
  sigs: normalizeSigs(tx),
  hash: tx.hash || hash(tx.cmd),
});
