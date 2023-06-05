import { IPollResponse, SendResponse } from '@kadena/chainweb-node-client';
import { IUnsignedCommand } from '@kadena/types';

import { IPactCommand } from './interfaces/IPactCommand';

export interface ICapV2 {
  addCap(cap: string, signer: string, ...args: any[]): this;
}

export interface ICommandBuilderV2 extends IPactCommand {
  createCommand(): IUnsignedCommand;
  addData: (data: IPactCommand['data']) => this;
  setMeta: (
    publicMeta: Partial<IPactCommand['publicMeta']> & {
      sender: IPactCommand['publicMeta']['sender'];
    },
    networkId?: IPactCommand['networkId'],
  ) => this;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  local(apiHost: string, options?: any): Promise<any>;
  send(apiHost: string): Promise<SendResponse>;
  pollUntil(
    apiHost: string,
    options?: {
      interval?: number;
      timeout?: number;
      onPoll?: (
        transaction: ICommandBuilderV2,
        pollRequest: Promise<IPollResponse>,
      ) => void;
    },
  ): Promise<this>;
  poll(apiHost: string): Promise<IPollResponse>;
  addSignatures(
    ...sig: {
      pubKey: string;
      sig: string;
    }[]
  ): ICommandBuilderV2;
  status: string;
  // setSigner(
  //   fn: (
  //     ...transactions: (IPactCommand &
  //       ICommandBuilder<Record<string, unknown>>)[]
  //   ) => Promise<this>,
  // ): ICommandBuilder<TCaps, TArgs> & IPactCommand;
}
