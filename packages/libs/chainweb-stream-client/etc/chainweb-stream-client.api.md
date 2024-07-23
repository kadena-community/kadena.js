## API Report File for "@kadena/chainweb-stream-client"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import EventEmitter from 'eventemitter2';

// @alpha (undocumented)
export class ChainwebStreamClient extends EventEmitter {
    constructor({ network, host, type, id, limit, connectTimeout, maxReconnects, heartbeatTimeout, confirmationDepth, }: IChainwebStreamConstructorArgs);
    // (undocumented)
    confirmationDepth: number;
    connect: () => void;
    // (undocumented)
    connectTimeoutMs: number;
    disconnect: () => void;
    // (undocumented)
    heartbeatTimeoutMs: number;
    // (undocumented)
    host: string;
    // (undocumented)
    id: string;
    // (undocumented)
    limit: number | undefined;
    // (undocumented)
    maxReconnects: number;
    // (undocumented)
    network: string;
    get state(): ConnectionState;
    // (undocumented)
    type: ChainwebStreamType;
}

// @alpha (undocumented)
export type ChainwebStreamType = 'event' | 'account';

// @alpha (undocumented)
export enum ConnectionState {
    // (undocumented)
    Closed = 2,
    // (undocumented)
    Connected = 1,
    // (undocumented)
    Connecting = 0,// error; will transition to 4 -> 0 almost immediately at first, then with exponential backoffs if not successful
    // (undocumented)
    None = 3,// before initialization
    // (undocumented)
    WaitReconnect = 4
}

// @alpha (undocumented)
export interface IAccountTransaction extends ITransactionBase {
    // (undocumented)
    amount: string;
    // (undocumented)
    crossChainAccount: number | null;
    // (undocumented)
    crossChainId: number | null;
    // (undocumented)
    fromAccount: string;
    // (undocumented)
    toAccount: string;
    // (undocumented)
    token: string;
}

// @alpha (undocumented)
export interface IChainwebStreamConfig {
    // (undocumented)
    heartbeat: number;
    // (undocumented)
    id: string;
    // (undocumented)
    maxConf: number;
    // (undocumented)
    network: string;
    // (undocumented)
    type: ChainwebStreamType;
    // (undocumented)
    v: string;
}

// @alpha (undocumented)
export interface IChainwebStreamConstructorArgs {
    // (undocumented)
    confirmationDepth?: number;
    // (undocumented)
    connectTimeout?: number;
    // (undocumented)
    heartbeatTimeout?: number;
    // (undocumented)
    host: string;
    // (undocumented)
    id: string;
    // (undocumented)
    limit?: number;
    // (undocumented)
    maxReconnects?: number;
    // (undocumented)
    network: string;
    // (undocumented)
    type: ChainwebStreamType;
}

// @alpha (undocumented)
export interface IDebugMsgObject {
    // (undocumented)
    consecutiveFailedAttempts?: number;
    // (undocumented)
    lastHeight?: number;
    // (undocumented)
    length?: number;
    // (undocumented)
    message?: string;
    // (undocumented)
    method: 'connect' | 'disconnect' | '_handleConnect' | '_handleError' | '_handleData' | '_handleHeights' | '_handleHeartbeatTimeout' | '_updateLastHeight' | string;
    // (undocumented)
    timeout?: number;
    // (undocumented)
    totalAttempts?: number;
    // (undocumented)
    ts: number;
    // (undocumented)
    url?: string;
    // (undocumented)
    willRetry?: boolean;
}

// @alpha (undocumented)
export interface IEventTransaction extends ITransactionBase {
    // (undocumented)
    moduleHash: string;
    // (undocumented)
    name: string;
    // (undocumented)
    params: string[];
}

// @alpha (undocumented)
export interface IHeightsEvent {
    // (undocumented)
    data: number;
}

// @alpha (undocumented)
export interface IInitialEvent {
    // (undocumented)
    config: IChainwebStreamConfig;
    // (undocumented)
    data: ITransaction[];
}

// @alpha (undocumented)
export type ITransaction = IEventTransaction | IAccountTransaction;

// @alpha (undocumented)
export interface ITransactionBase {
    // (undocumented)
    blockHash: string;
    // (undocumented)
    blockTime: string;
    // (undocumented)
    chain: number;
    // (undocumented)
    height: number;
    // (undocumented)
    idx: number;
    // (undocumented)
    meta: {
        id: string;
        confirmations: number;
    };
    // (undocumented)
    requestKey: string;
}

// (No @packageDocumentation comment for this package)

```