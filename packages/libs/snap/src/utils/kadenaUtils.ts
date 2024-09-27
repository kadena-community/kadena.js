import { SLIP10Node } from '@metamask/key-tree';
import { DerivedAccount } from '../types';
import { BASE_ACCOUNT_NAME } from './constants';

export async function getKeyDeriver() {
  const kadenaNode = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "626'"],
      curve: 'ed25519',
    },
  });

  const kadenaSlip10Node = await SLIP10Node.fromJSON(kadenaNode);
  return kadenaSlip10Node;
}

export interface GetKeysFromIndexParams {
  index: number;
}

export const getAccountsFromIndex = async (
  keyDeriver: SLIP10Node,
  index: number,
): Promise<DerivedAccount> => {
  const derived = await keyDeriver.derive([`slip10:${index}'`]);
  return {
    index,
    address: derived.publicKey.replace(/^0x00/, 'k:'),
    name: `${BASE_ACCOUNT_NAME} ${index + 1}`,
    privateKey: derived.privateKey,
    publicKey: derived.publicKey,
  };
};
