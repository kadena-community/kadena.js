## API Report File for "@kadena/client-utils"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { ChainId } from '@kadena/client';
import { ChainId as ChainId_2 } from '@kadena/types';
import { ICommand } from '@kadena/types';
import { ICommandResult } from '@kadena/chainweb-node-client';
import type { INetworkOptions } from '@kadena/client';
import type { IPactCommand } from '@kadena/client';
import { IPactDecimal } from '@kadena/types';
import { IPactInt } from '@kadena/types';
import { IPartialPactCommand } from '@kadena/client/lib/interfaces/IPactCommand';
import type { ISigner } from '@kadena/client';
import type { ISignFunction } from '@kadena/client';
import { ITransactionDescriptor } from '@kadena/client';
import { IUnsignedCommand } from '@kadena/types';
import { PactValue } from '@kadena/types';

// Warning: (ae-forgotten-export) The symbol "ICreateAccountCommandInput" needs to be exported by the entry point index.d.ts
// Warning: (ae-forgotten-export) The symbol "IClientConfig" needs to be exported by the entry point index.d.ts
// Warning: (ae-forgotten-export) The symbol "IEmitterWrapper" needs to be exported by the entry point index.d.ts
//
// @alpha (undocumented)
export const createAccount: (inputs: ICreateAccountCommandInput, config: IClientConfig) => IEmitterWrapper<[{
event: "command";
data: IUnsignedCommand;
}, {
event: "sign";
data: ICommand;
}, {
event: "preflight";
data: ICommandResult;
}, {
event: "submit";
data: ITransactionDescriptor;
}, {
event: "listen";
data: ICommandResult;
}], [], any>;

// @alpha (undocumented)
export const createAccountCommand: ({ account, keyset, gasPayer, chainId, contract, }: ICreateAccountCommandInput) => (cmd?: (Partial<IPartialPactCommand> | (() => Partial<IPartialPactCommand>)) | undefined) => Partial<IPartialPactCommand>;

// Warning: (ae-forgotten-export) The symbol "ICrossChainInput" needs to be exported by the entry point index.d.ts
//
// @alpha (undocumented)
export const createCrossChainCommand: ({ sender, receiver, amount, targetChainId, gasPayer, chainId, contract, }: Omit<ICrossChainInput, 'targetChainGasPayer'>) => (cmd?: (Partial<IPartialPactCommand> | (() => Partial<IPartialPactCommand>)) | undefined) => Partial<IPartialPactCommand>;

// @alpha (undocumented)
export const details: (account: string, networkId: string, chainId: ChainId, host?: IClientConfig['host'], contract?: string) => any;

// @alpha (undocumented)
export const discoverAccount: (account: string, networkId: string, host?: IClientConfig['host'], contract?: string) => IEmitterWrapper<[{
event: "query-result";
data: {
result: any;
chainId: ChainId_2 | undefined;
}[];
}], [{
event: "chain-result";
data: {
result: any;
chainId: ChainId_2;
};
}], Promise<{
result: any;
chainId: ChainId_2 | undefined;
}[]>>;

// @alpha (undocumented)
export const getBalance: (account: string, networkId: string, chainId: ChainId, host?: IClientConfig['host'], contract?: string) => Promise<any>;

// Warning: (ae-forgotten-export) The symbol "ISafeTransferInput" needs to be exported by the entry point index.d.ts
//
// @alpha (undocumented)
export const partialTransferCommand: ({ sender, amount, receiver, contract, }: Omit<ISafeTransferInput, 'gasPayer' | 'chainId'>) => (cmd?: (Partial<IPartialPactCommand> | (() => Partial<IPartialPactCommand>)) | undefined) => Partial<IPartialPactCommand>;

// Warning: (ae-forgotten-export) The symbol "IRotateCommandInput" needs to be exported by the entry point index.d.ts
//
// @alpha (undocumented)
export const rotate: (inputs: IRotateCommandInput, config: IClientConfig) => IEmitterWrapper<[{
event: "command";
data: IUnsignedCommand;
}, {
event: "sign";
data: ICommand;
}, {
event: "preflight";
data: ICommandResult;
}, {
event: "submit";
data: ITransactionDescriptor;
}, {
event: "listen";
data: ICommandResult;
}], [], any>;

// @alpha (undocumented)
export const rotateCommand: ({ account, newguard, gasPayer, chainId, contract, }: IRotateCommandInput) => (cmd?: (Partial<IPartialPactCommand> | (() => Partial<IPartialPactCommand>)) | undefined) => Partial<IPartialPactCommand>;

// @alpha (undocumented)
export const safeTransfer: (inputs: ISafeTransferInput, config: IClientConfig) => IEmitterWrapper<[{
event: "command";
data: IUnsignedCommand;
}, {
event: "sign";
data: ICommand;
}, {
event: "preflight";
data: ICommandResult;
}, {
event: "submit";
data: ITransactionDescriptor;
}, {
event: "listen";
data: ICommandResult;
}], [], Promise<string> | Promise<number> | Promise<false> | Promise<true> | Promise<IPactInt> | Promise<IPactDecimal> | Promise<Date> | Promise<PactValue[]> | Promise<Record<string, any>>>;

// @alpha (undocumented)
export const safeTransferCommand: ({ sender, receiver, amount, gasPayer, chainId, contract, }: ISafeTransferInput) => (cmd?: (Partial<IPartialPactCommand> | (() => Partial<IPartialPactCommand>)) | undefined) => Partial<IPartialPactCommand>;

// Warning: (ae-forgotten-export) The symbol "ISafeTransferCreateInput" needs to be exported by the entry point index.d.ts
//
// @alpha (undocumented)
export const safeTransferCreate: (inputs: ISafeTransferCreateInput, config: IClientConfig) => IEmitterWrapper<[{
event: "command";
data: IUnsignedCommand;
}, {
event: "sign";
data: ICommand;
}, {
event: "preflight";
data: ICommandResult;
}, {
event: "submit";
data: ITransactionDescriptor;
}, {
event: "listen";
data: ICommandResult;
}], [], Promise<string> | Promise<number> | Promise<false> | Promise<true> | Promise<IPactInt> | Promise<IPactDecimal> | Promise<Date> | Promise<PactValue[]> | Promise<Record<string, any>>>;

// @alpha (undocumented)
export const safeTransferCreateCommand: ({ sender, receiver, amount, gasPayer, chainId, contract, }: ISafeTransferCreateInput) => (cmd?: (Partial<IPartialPactCommand> | (() => Partial<IPartialPactCommand>)) | undefined) => Partial<IPartialPactCommand>;

// Warning: (ae-forgotten-export) The symbol "ITransferInput" needs to be exported by the entry point index.d.ts
//
// @alpha (undocumented)
export const transfer: (inputs: ITransferInput, config: IClientConfig) => IEmitterWrapper<[{
event: "command";
data: IUnsignedCommand;
}, {
event: "sign";
data: ICommand;
}, {
event: "preflight";
data: ICommandResult;
}, {
event: "submit";
data: ITransactionDescriptor;
}, {
event: "listen";
data: ICommandResult;
}], [], any>;

// @alpha (undocumented)
export const transferCommand: ({ sender, receiver, amount, gasPayer, chainId, contract, }: ITransferInput) => (cmd?: (Partial<IPartialPactCommand> | (() => Partial<IPartialPactCommand>)) | undefined) => Partial<IPartialPactCommand>;

// Warning: (ae-forgotten-export) The symbol "ICreateTransferInput" needs to be exported by the entry point index.d.ts
//
// @alpha (undocumented)
export const transferCreate: (inputs: ICreateTransferInput, config: IClientConfig) => IEmitterWrapper<[{
event: "command";
data: IUnsignedCommand;
}, {
event: "sign";
data: ICommand;
}, {
event: "preflight";
data: ICommandResult;
}, {
event: "submit";
data: ITransactionDescriptor;
}, {
event: "listen";
data: ICommandResult;
}], [], any>;

// @alpha (undocumented)
export const transferCreateCommand: ({ sender, receiver, amount, gasPayer, chainId, contract, }: ICreateTransferInput) => (cmd?: (Partial<IPartialPactCommand> | (() => Partial<IPartialPactCommand>)) | undefined) => Partial<IPartialPactCommand>;

// @alpha (undocumented)
export const transferCrossChain: (inputs: ICrossChainInput, config: IClientConfig) => IEmitterWrapper<[{
event: "sign";
data: ICommand;
}, {
event: "preflight";
data: ICommandResult;
}, {
event: "submit";
data: ITransactionDescriptor;
}, {
event: "listen";
data: ICommandResult;
}, {
event: "spv-proof";
data: {
pactId: string;
step: number;
proof: string;
rollback: boolean;
data: {};
};
}, {
event: "gas-station" | "sign-continuation";
data: ICommand;
}, {
event: "submit-continuation";
data: ITransactionDescriptor;
}, {
event: "listen-continuation";
data: ICommandResult;
}], [{
event: "poll-spv";
data: string;
}], any>;

// (No @packageDocumentation comment for this package)

```