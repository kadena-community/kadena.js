/* istanbul ignore file */
// this module is juts a mock for the sign function

import { ICommand } from './commandBuilder';

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
