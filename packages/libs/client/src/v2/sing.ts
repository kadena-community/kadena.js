// it can change the command, usually only the nonce, for security reason or adding some data to track later

import { ICommand } from './pact';

// TODO: if the reason for returning the command is only nonce, maybe it's better to only return nonce
export declare const sign: (
  command: ICommand,
) => Promise<{ cmd: string; sigs: string[] }>;

// it doesn't change the command so only returns the list of signatures
export declare const quicksign: (command: string) => Promise<string[]>;
