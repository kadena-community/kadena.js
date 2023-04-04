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
}

export interface IChainwebSSEMetaData {
  meta: {
    id: string;
    confirmations: number;
  };
}

export type EventData = IChainwebEventData & IChainwebSSEMetaData;

export type AccountData = IChainwebEventData & IChainwebSSEMetaData;

export type GenericData = EventData | AccountData;

export interface IChainwebStreamConstructorArgs {
  type: ChainwebStreamType;
  id: string;
  host: string;
  // TODO network ? for sanity check/safety
  limit?: number;
}

export enum ConnectionState {
  Connecting = 0,
  Connected = 1,
  Closed = 2, // error; will transition to 0 almost immediately at first, then with exponential backoffs if not successful
  None = 3, // before initialization
  WaitReconnect = 4, // the waiting stage of exponential backoff reconnection strategy
  // Error = 5, // TODO? For eventsource that failed too many times to retry
}
