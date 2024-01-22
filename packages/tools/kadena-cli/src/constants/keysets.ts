export interface IKeyset {
  name: string;
  predicate: string;
  publicKeysFromKeypairs: string[];
  publicKeys: string;
}

export const keysetDefaults: Record<string, IKeyset> = {
  sender00: {
    name: 'sender00',
    predicate: 'keys-all',
    publicKeysFromKeypairs: ['sender00'],
    publicKeys: '',
  },
};

export const defaultKeysetsPath: string = `${process.cwd()}/.kadena/keysets`;
