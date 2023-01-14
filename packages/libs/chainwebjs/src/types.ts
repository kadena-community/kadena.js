export interface IConfig {
  network: string;
  host: string;
}

export interface IBufferHeader {
  txCount: number;
  powHash: string;
  header: IBlockHeader;
  target: string;
}

export interface IHeaderBuffer {
  depth: number;
  callback: (header: IBufferHeader) => void;
  curHeight: number | undefined;
  buffer: IBufferHeader[];
  add: (u: IBufferHeader) => void;
}

interface IOnFailedAttempt extends Error {
  message: string;
}

export interface IRetryOptions {
  onFailedAttempt?: (x: IOnFailedAttempt) => void;
  retries?: number;
  minTimeout?: number;
  randomize?: boolean;
  retry404?: boolean;
}

export interface ICutResponse {
  origin: undefined;
  height: number;
  weight: string;
  hashes: { [key: string]: ICutHash };
  id: string;
  instance: string;
}

export interface ICutHash {
  height: number;
  hash: string;
}

export interface ICutPeerItem {
  address: ICutPeerAddress;
  id: undefined | string;
}

export interface ICutPeerAddress {
  hostname: string;
  port: number;
}

export interface IPagedResponse<T> {
  next?: string;
  items: T[];
  limit?: number;
}

export interface IBlockHeader {
  creationTime: number;
  parent: string;
  height: number;
  hash: string;
  chainId: number;
  weight: string;
  featureFlags: number;
  epochStart: number;
  adjacents: { [key: string]: string };
  payloadHash: string;
  chainwebVersion: string;
  target: string;
  nonce: string;
}

export interface IHeaderBranchRequestBody {
  lower: string[];
  upper: string[];
}

export interface IBlockPayloads<T> {
  header: IBlockHeader;
  payload: IBlockPayloadMap<T>;
}

export interface IBlockPayloadMap<T>
  extends Pick<
    IBlockPayload<T>,
    'transactions' | 'payloadHash' | 'transactionsHash' | 'outputsHash'
  > {
  minerData: IMinerData;
  coinbase: ICoinbase;
}

export interface IBlockPayload<T> {
  transactions: T[];
  minerData: string;
  coinbase: string;
  payloadHash: string;
  transactionsHash: string;
  outputsHash: string;
}

export interface ICoinbase {
  gas: number;
  result: IResult;
  reqKey: string;
  logs: string;
  events: IEventData[];
  metaData: undefined;
  continuation: undefined;
  txId: number;
}

export interface IEventData {
  height?: number;
  params: Array<number | string>;
  name: string;
  module: IModule;
  moduleHash: string;
}

export interface IModule {
  namespace: undefined;
  name: string;
}

export interface IResult {
  status: string;
  data: string;
}

export interface IMinerData {
  account: string;
  predicate: string;
  'public-keys': string[];
}

export interface ITransactionElement {
  height?: number;
  transaction: ITransactionPayload;
  output: ICoinbase;
}

export interface ITransactionPayload {
  hash: string;
  sigs: ISig[];
  cmd: ICmd;
}

export interface ICmd {
  networkId: string;
  payload: ICmdPayload;
  signers: ISigner[];
  meta: IMeta;
  nonce: string;
}

export interface IMeta {
  creationTime: number;
  ttl: number;
  gasLimit: number;
  chainId: string;
  gasPrice: number;
  sender: string;
}

export interface ICmdPayload {
  exec: IExec;
}

export interface IExec {
  data: IData;
  code: string;
}

export interface IData {
  keyset: IKeyset;
}

export interface IKeyset {
  pred: string;
  keys: string[];
}

export interface ISigner {
  pubKey: string;
}

export interface ISig {
  sig: string;
}

export interface IEventMessage {
  type: string;
  data: IBufferHeader;
  lastEventId: string;
  origin: string;
}
