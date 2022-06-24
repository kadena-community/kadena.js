import { Base16String } from './Base16String';
import { Command } from './PactCommand';

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
