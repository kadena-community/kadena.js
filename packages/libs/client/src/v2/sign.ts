/* istanbul ignore file */
// this module is juts a mock for the sign function

import { ICommand } from './pact';

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

type ExtendTypeForm<T> = (arg: T) => string;

const myFn = <T extends any>(cb: ExtendTypeForm<T>): T =>
  ((arg: any) => arg) as any;

const builder = (arg: { name: string; args: any[] }) => {};

builder(myFn((arg: { name: string; args: any[] }) => arg.name));
