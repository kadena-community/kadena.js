export type Alias = {
  account: `k:${string}`;
};

export const MOCK_DATA: Record<string, Alias> = {
  bart: {
    account:
      "k:5a7a25c465dd72cbc9a166e7a6ac1a24e8bdc59a194998ce10c70aa09604ce1c",
  },
  andy: {
    account:
      "k:fab0be1b8ddfe375e69567d04b95b6294b4cce8e22e6ad8a969e829be4c11488",
  },
};

export const resolveAccountAlias = async (alias: string) => {
  return MOCK_DATA[alias] ?? null;
};
