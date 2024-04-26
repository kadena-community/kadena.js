interface ICreateSignersProps {
  count: number;
  startSignedCount: number;
  endSignedCount?: number;
  startNotAllowedCount?: number;
  endNotAllowedCount?: number;
}

const createSigner = ({
  count,
  startSignedCount,
  endSignedCount = 999999,
  startNotAllowedCount,
  endNotAllowedCount = 99999,
}: ICreateSignersProps): IProofOfUsSignee => {
  const shouldBeSigned = (idx: number) => {
    let value: ISignerStatus =
      idx >= startSignedCount && idx <= endSignedCount ? 'success' : 'init';

    value =
      startNotAllowedCount &&
      idx >= startNotAllowedCount &&
      idx <= endNotAllowedCount
        ? 'notsigning'
        : value;

    return value;
  };

  return {
    accountName: `account ${count}`,
    alias: `alias ${count}`,
    initiator: count === 0,
    signerStatus: shouldBeSigned(count),
    publicKey: `publicKey${count}`,
    signature:
      shouldBeSigned(count) === 'success' ? `signature${count}` : undefined,
  } as unknown as IProofOfUsSignee;
};

export const createSigners = ({
  count,
  startSignedCount,
  endSignedCount = 999999,
  startNotAllowedCount,
  endNotAllowedCount = 99999,
}: ICreateSignersProps): IProofOfUsSignee[] => {
  const signers: IProofOfUsSignee[] = [];

  for (let i = 0; i < count; i++) {
    const signee = createSigner({
      count: i,
      startSignedCount,
      endSignedCount,
      startNotAllowedCount,
      endNotAllowedCount,
    });

    signers.push(signee);
  }

  return signers;
};

export const createSignersObject = ({
  count,
  startSignedCount,
  endSignedCount = 999999,
  startNotAllowedCount,
  endNotAllowedCount = 99999,
}: ICreateSignersProps): Record<string, IProofOfUsSignee> => {
  const signers: Record<string, IProofOfUsSignee> = {};

  for (let i = 0; i < count; i++) {
    const signee = createSigner({
      count: i,
      startSignedCount,
      endSignedCount,
      startNotAllowedCount,
      endNotAllowedCount,
    });

    signers[`account${i}`] = signee;
  }

  return signers;
};
