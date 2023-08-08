import { sign } from '@kadena/cryptography-utils';
import { ICommand, IUnsignedCommand } from '@kadena/types';

export function signByKeyPair(
  transaction: IUnsignedCommand,
  publicKey: string,
): ICommand {
  let keyPair;
  switch (publicKey) {
    // This is our test account
    case '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937':
      keyPair = {
        publicKey:
          '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
        secretKey:
          'e97b30547784bf05eb71a765b1d45127ed89d9b3c0cf21b71a107efb170eed33',
      };
      break;
    // This is Sender00.
    default:
      keyPair = {
        publicKey:
          '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
        secretKey:
          '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
      };
      break;
  }
  const { sig } = sign(transaction.cmd, keyPair);
  if (sig === undefined) {
    throw new Error('SIG_IS_UNDEFINED');
  }
  transaction.sigs = [{ sig }];
  return transaction as ICommand;
}
