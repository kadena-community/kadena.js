import { sign } from '@kadena/cryptography-utils';
import { ICommand, IUnsignedCommand } from '@kadena/types';

export function signByKeyPair(transaction: IUnsignedCommand): ICommand {
  const { sig } = sign(transaction.cmd, {
    secretKey:
      '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
    publicKey:
      '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  });
  if (sig === undefined) {
    throw new Error('SIG_IS_UNDEFINED');
  }
  transaction.sigs = [{ sig }];
  return transaction as ICommand;
}
