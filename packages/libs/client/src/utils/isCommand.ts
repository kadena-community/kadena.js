import { ICommand } from '../interfaces/ICommand';

export const isCommand = (command: Partial<ICommand>): command is ICommand => {
  if (command.payload === undefined) return false;

  if (!('code' in command.payload) || !('pactId' in command.payload))
    return false;
  if (command.networkId === undefined) return false;
  if (command.nonce === undefined) return false;
  if (command.meta === undefined) return false;
  if (command.meta.chainId === undefined) return false;
  if (command.meta.creationTime === undefined) return false;
  if (command.meta.gasLimit === undefined) return false;
  if (command.meta.gasPrice === undefined) return false;
  if (command.meta.ttl === undefined) return false;

  return true;
};
