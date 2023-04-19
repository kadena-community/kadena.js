export type ChainwebStreamType = 'event' | 'account';

export interface IChainwebBaseData {
  blockTime: string;
  height: number;
  blockHash: string;
  requestKey: string;
  idx: number;
  chain: number;
}

export interface IChainwebEventData extends IChainwebBaseData {
  params: string[];
  name: string;
  moduleHash: string;
}

export interface IChainwebAccountData extends IChainwebBaseData {
  amount: string;
  token: string;
  fromAccount: string;
  toAccount: string;
  crossChainId: number | null;
  crossChainAccount: number | null;
}

export interface IChainwebStreamMetadata {
  meta: {
    id: string;
    confirmations: number;
  };
}

export type EventTransaction = IChainwebEventData & IChainwebStreamMetadata;

export type AccountTransaction = IChainwebEventData & IChainwebStreamMetadata;

export type Transaction = EventTransaction | AccountTransaction;

export interface ChainwebStreamConstructorArgs {
  type: ChainwebStreamType;
  id: string;
  host: string;
  // TODO network ? for sanity check/safety
  limit?: number;
  connectTimeout?: number;
  heartbeatTimeout?: number;
  maxReconnects?: number;
  confirmationDepth?: number;
}

export enum ConnectionState {
  Connecting = 0,
  Connected = 1,
  Closed = 2, // error; will transition to 4 -> 0 almost immediately at first, then with exponential backoffs if not successful
  None = 3, // before initialization
  WaitReconnect = 4, // the waiting stage of exponential backoff reconnection strategy
  // Error = 5, // TODO? For eventsource that failed too many times to retry
}

export interface DebugMsgObject {
  // Unix timestamp (milliseconds)
  ts: number;

  // Internal method that triggered the debug event
  method:
    | 'connect'
    | 'disconnect'
    | '_handleConnect'
    | '_handleError'
    | '_handleData'
    | '_handleHeartbeatTimeout';

  /*
   * certain events have event-specific fields as well:
   */
  consecutiveFailedAttempts?: number;
  totalAttempts?: number;
  message?: string;
  willRetry?: boolean;
  timeout?: number;
  length?: number;
}
