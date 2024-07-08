import { IPactCommand, IUnsignedCommand } from '@kadena/client';

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

const sigScheme = (
  sigs: SigData | CommandSigData | CommandJson,
): 'SigData' | 'CommandSigData' | 'CommandJson' | 'unknown' => {
  if (Array.isArray(sigs)) {
    if (sigs.every((item) => item && 'pubKey' in item)) {
      return 'CommandSigData';
    }
    if (
      sigs.every((item) => item === null || item === undefined || 'sig' in item)
    ) {
      return 'CommandJson';
    }
  } else if (typeof sigs === 'object') {
    return 'SigData';
  }
  return 'unknown';
};

export function normalizeSigs(tx: IUnsignedCommand): IUnsignedCommand['sigs'] {
  const cmd: IPactCommand = JSON.parse(tx.cmd);
  const scheme = sigScheme(tx.sigs);
  if (scheme === 'SigData') {
    const sigs = tx.sigs as unknown as SigData;
    const normalizedSigs = cmd.signers.map(({ pubKey }) =>
      sigs[pubKey]
        ? {
            sig: sigs[pubKey],
          }
        : undefined,
    );
    return normalizedSigs;
  }
  if (scheme === 'CommandSigData') {
    const sigs = tx.sigs as unknown as CommandSigData;
    const normalizedSigs = cmd.signers.map(({ pubKey }) => {
      const item = sigs.find((s) => s.pubKey === pubKey);
      return item && item.sig ? { sig: item.sig } : undefined;
    });
    return normalizedSigs;
  }
  if (scheme === 'CommandJson') {
    return tx.sigs;
  }

  return cmd.signers.map(() => undefined);
}
