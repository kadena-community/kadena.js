/**
 * @alpha
 */
export type ChainwebStreamType = 'event' | 'account';

/**
 * @alpha
 */
export interface ITransactionBase {
  blockTime: string;
  height: number;
  blockHash: string;
  requestKey: string;
  idx: number;
  chain: number;
  meta: {
    id: string;
    confirmations: number;
  };
}

/**
 * @alpha
 */
export interface IEventTransaction extends ITransactionBase {
  params: string[];
  name: string;
  moduleHash: string;
}

/**
 * @alpha
 */
export interface IAccountTransaction extends ITransactionBase {
  amount: string;
  token: string;
  fromAccount: string;
  toAccount: string;
  // ignoring linting rule; this describes the existing chainweb-stream JSON structure
  // eslint-disable-next-line @rushstack/no-new-null
  crossChainId: number | null;
  // eslint-disable-next-line @rushstack/no-new-null
  crossChainAccount: number | null;
}

/**
 * @alpha
 */
export type ITransaction = IEventTransaction | IAccountTransaction;

/**
 * @alpha
 */
export interface IChainwebStreamConfig {
  network: string;
  type: ChainwebStreamType;
  id: string;
  maxConf: number;
  heartbeat: number;
  v: string;
}

/**
 * @alpha
 */
export interface IInitialEvent {
  config: IChainwebStreamConfig;
  data: ITransaction[];
}

/**
 * @alpha
 */
export interface IChainwebStreamConstructorArgs {
  network: string;
  type: ChainwebStreamType;
  id: string;
  host: string;
  limit?: number;
  connectTimeout?: number;
  heartbeatTimeout?: number;
  maxReconnects?: number;
  confirmationDepth?: number;
}

/**
 * @alpha
 */
export interface IHeightsEvent {
  data: number;
}

/**
 * @alpha
 */
export enum ConnectionState {
  Connecting = 0,
  Connected = 1,
  Closed = 2, // error; will transition to 4 -> 0 almost immediately at first, then with exponential backoffs if not successful
  None = 3, // before initialization
  WaitReconnect = 4, // the waiting stage of exponential backoff reconnection strategy
  // Error = 5, // TODO? For eventsource that failed too many times to retry
}

/**
 * @alpha
 */
export interface IDebugMsgObject {
  // Unix timestamp (milliseconds)
  ts: number;

  // Internal method that triggered the debug event
  method:
    | 'connect'
    | 'disconnect'
    | '_handleConnect'
    | '_handleError'
    | '_handleData'
    | '_handleHeights'
    | '_handleHeartbeatTimeout'
    | '_updateLastHeight'
    | string;

  /*
   * certain events have event-specific fields as well:
   */
  consecutiveFailedAttempts?: number;
  totalAttempts?: number;
  message?: string;
  willRetry?: boolean;
  timeout?: number;
  length?: number;
  lastHeight?: number;
  url?: string;
}
