// it can change the command, usually only the nonce, for security reason or adding some data to track later

import { ICommand } from './pact';

// TODO: if the reason for returning the command is only nonce, maybe it's better to only return nonce
export const sign = (command: ICommand) =>
  Promise.resolve({
    cmd: JSON.stringify(command),
    sigs: command.signers?.map(({ pubKey }) => pubKey) ?? [],
  });

// it doesn't change the command so only returns the list of signatures
export const quicksign = (command: string) => {
  const cmd: ICommand = JSON.parse(command);
  return Promise.resolve(cmd.signers?.map(({ pubKey }) => pubKey) || []);
};
