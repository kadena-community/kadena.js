import { Base16String } from './Base16String';
import { Command } from './PactCommand';

export type PollRequest = RequestKeys;

export interface RequestKeys {
  requestKeys: Base16String[];
}

export interface ListenRequest {
  listen: Base16String;
}

export interface PublicRequest {
  cmds: Command[];
}
