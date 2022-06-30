import type { Base16String } from './Base16String';
import type { Command } from './PactCommand';

// TODO: Add descriptions
export type RequestKeys = {
  requestKeys: Base16String[];
};

export type LocalRequest = Command;

export type SendRequest = {
  cmds: Array<Command>;
};

export type PollRequest = RequestKeys;

export type ListenRequest = {
  listen: Base16String;
};
