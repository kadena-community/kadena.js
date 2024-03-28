export const convertSignersObjectToArray = (
  obj?: Record<string, IProofOfUsSignee>,
): IProofOfUsSignee[] => {
  if (!obj) return [];

  if (!Array.isArray(obj)) {
    const newArray = Object.entries(obj).map(([key, value]) => value);

    const initiator = newArray.find((a) => a.initiator);
    const restArray = newArray
      .filter((a) => !a.initiator)
      .sort((a, b) => {
        if (a.accountName < b.accountName) return -1;
        if (a.accountName > b.accountName) return 1;
        return 0;
      });

    return initiator ? [initiator, ...restArray] : [...restArray];
  }

  return [];
};
