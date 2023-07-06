import {
  ConnectTimeoutError,
  HeartbeatTimeoutError,
  parseError,
} from './errors';
import { isClientAhead, isMajorCompatible, isMinorCompatible } from './semver';
import {
  ChainwebStreamType,
  ConnectionState,
  IChainwebStreamConfig,
  IChainwebStreamConstructorArgs,
  IDebugMsgObject,
  IInitialEvent,
  ITransaction,
} from './types';

import EventEmitter from 'eventemitter2';
import EventSource from 'eventsource';

export * from './types';

const CLIENT_PROTOCOL_VERSION: string = '0.0.2';

const DEFAULT_CONFIRMATION_DEPTH: number = 6;
const DEFAULT_CONNECT_TIMEOUT: number = 28_000;
const DEFAULT_HEARTBEAT_TIMEOUT: number = 35_000;
const DEFAULT_MAX_RECONNECTS: number = 6;
const DEFAULT_LIMIT: number = 100;

/**
 * @alpha
 */
class ChainwebStream extends EventEmitter {
  // chainweb network, e.g. mainnet01
  public network: string;

  // chainweb-stream backend host, full URI - e.g. https://sse.chainweb.com
  public host: string;

  public type: ChainwebStreamType;

  // module.event / module / account pubkey
  public id: string;

  // limit for initial data stream
  public limit: number | undefined;

  // initial connection timeout in ms
  public connectTimeoutMs: number;

  // heartbeat timeout in ms
  public heartbeatTimeoutMs: number;

  // maximum number of reconnection attempts
  // will emit error after
  public maxReconnects: number;

  // depth at which a block/transaction is considered confirmed
  // must be less than or equal to the corresponding server configuration
  public confirmationDepth: number;

  // desired eventsource state
  private _desiredState: ConnectionState = ConnectionState.None;
  // TODO the "WaitReconnect" state is currently stored in desiredState.
  // Consider if this is the behavior we want

  // underlying event source object
  private _eventSource?: EventSource;

  // last tracked height, used for resuming gracefully
  private _lastHeight?: number;

  // counter for failed connection attempts; used for exponential backoff
  private _failedConnectionAttempts: number = 0;

  // total failed connection attempts; used to emit reconnect instead of connect
  private _totalConnectionAttempts: number = 0;

  // connect timeout for better error handling on an unresponsive server with an open socket (ctrl+z the sse server to simulate this)
  private _connectTimer?: ReturnType<typeof setTimeout>;

  // heartbeat timer
  private _heartbeatTimer?: ReturnType<typeof setTimeout>;

  // reconnect timer
  private _reconnectTimer?: ReturnType<typeof setTimeout>;

  public constructor({
    network,
    host,
    type,
    id,
    limit,
    connectTimeout,
    maxReconnects,
    heartbeatTimeout,
    confirmationDepth,
  }: IChainwebStreamConstructorArgs) {
    super();
    this.network = network;
    this.type = type;
    this.id = id;
    this.host = host.endsWith('/') ? host.substr(0, host.length - 1) : host; // strip trailing slash if provided
    this.limit = limit ?? DEFAULT_LIMIT;
    this.connectTimeoutMs = connectTimeout ?? DEFAULT_CONNECT_TIMEOUT;
    this.heartbeatTimeoutMs = heartbeatTimeout ?? DEFAULT_HEARTBEAT_TIMEOUT;
    this.maxReconnects = maxReconnects ?? DEFAULT_MAX_RECONNECTS;
    this.confirmationDepth = confirmationDepth ?? DEFAULT_CONFIRMATION_DEPTH;
  }

  /**
   * Call to initialize connection
   */
  public connect = (): void => {
    this._debug('connect');
    this._desiredState = ConnectionState.Connected;
    this._eventSource = new EventSource(this._makeConnectionURL());
    this._eventSource.onopen = this._handleConnect;
    this._eventSource.onerror = this._handleError;
    // reset & set custom connect timeout handler
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this._connectTimer) {
      clearTimeout(this._connectTimer);
    }
    this._connectTimer = setTimeout(
      () => this._handleError(new ConnectTimeoutError(this.connectTimeoutMs)),
      this.connectTimeoutMs,
    );
  };

  /**
   * Call to disconnect
   */
  public disconnect = (): void => {
    this._desiredState = ConnectionState.Closed;
    this._eventSource?.close();
    this._eventSource = undefined;
    this._stopHeartbeatMonitor();
    this._debug('disconnect');
  };

  /**
   * .state getter - get current stream client state
   */
  public get state(): ConnectionState {
    const { _eventSource } = this;
    // special case: are we waiting to reconnect? (expo backoff)
    if (this._desiredState === ConnectionState.WaitReconnect) {
      return this._desiredState;
    }
    if (_eventSource) {
      return _eventSource.readyState;
    }
    return ConnectionState.None;
  }

  private _handleConnect = (): void => {
    const {
      _failedConnectionAttempts: consecutiveFailedAttempts,
      _totalConnectionAttempts: totalAttempts,
      _eventSource,
    } = this;
    this._debug('_handleConnect', { consecutiveFailedAttempts, totalAttempts });
    this._failedConnectionAttempts = 0;
    if (!_eventSource) {
      throw new Error(
        'ChainwebStream._handleConnect called without an _eventSource. This should never happen',
      );
    }
    _eventSource.addEventListener('initial', this._handleInitial);
    _eventSource.addEventListener('message', this._handleData);
    _eventSource.addEventListener('ping', this._resetHeartbeatTimeout);
    this._resetHeartbeatTimeout();
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this._connectTimer) {
      clearTimeout(this._connectTimer);
    }
    this.emit(this._totalConnectionAttempts ? 'reconnect' : 'connect');
    this._totalConnectionAttempts += 1;
  };

  /*
   * Chrome has different reconnecting strategy (some) vs Firefox (none)
   * so we disable reconnections and handle them manually
   */
  private _handleError = (
    err: HeartbeatTimeoutError | ConnectTimeoutError | Event,
  ): void => {
    this._failedConnectionAttempts += 1;
    this._totalConnectionAttempts += 1;

    // close event source; crucial - chrome reconnects, firefox does not
    this._eventSource?.close();

    // cancel connection timeout timer, if exists
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this._connectTimer) {
      clearTimeout(this._connectTimer);
    }

    const message = parseError(err);

    const willRetry = this._failedConnectionAttempts < this.maxReconnects;
    const timeout = this._getTimeout();
    this._debug('_handleError', { message, willRetry, timeout });

    if (!willRetry) {
      this._emitError(message);
      this.disconnect();
      return;
    }

    this.emit('warn', message);
    this.emit('will-reconnect', {
      attempt: this._failedConnectionAttempts,
      timeout,
      message,
    });

    this._desiredState = ConnectionState.WaitReconnect;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
    }
    this._reconnectTimer = setTimeout(this.connect, timeout);
  };

  private _handleInitial = (msg: MessageEvent<string>): void => {
    this._debug('_handleData', { length: msg.data?.length });

    const message = JSON.parse(msg.data) as IInitialEvent;

    const { config, data } = message;

    if (!this._validateServerConfig(config)) {
      return;
    }

    this._processData(data);
  };

  private _handleData = (msg: MessageEvent<string>): void => {
    this._debug('_handleData', { length: msg.data?.length });

    const message = JSON.parse(msg.data) as ITransaction;

    this._processData([message]);

    this._resetHeartbeatTimeout();
  };

  private _processData(data: ITransaction[]): void {
    this._lastHeight = data.reduce(
      (highest, { height }) => (height > highest ? height : highest),
      this._lastHeight ?? 0,
    );

    for (const element of data) {
      const {
        meta: { confirmations },
      } = element;
      this.emit('data', element);
      if (confirmations >= this.confirmationDepth) {
        this.emit('confirmed', element);
      } else {
        this.emit('unconfirmed', element);
      }
    }
  }

  private _emitError(msg: string): void {
    console.error(msg);
    this.emit('error', msg);
  }

  private _validateServerConfig(config: IChainwebStreamConfig): boolean {
    const {
      network,
      type,
      id,
      maxConf,
      heartbeat,
      v: serverProtocolVersion,
    } = config;

    const fail = (msg: string): false => {
      this.disconnect();
      this._emitError(msg);
      return false;
    };

    if (network !== this.network) {
      return fail(
        `Network mismatch: wanted ${this.network}, server is ${network}.`,
      );
    }

    if (type !== this.type) {
      return fail(
        `Parameter mismatch: Expected transactions of type "${this.type}" but received "${type}". This should never happen.`,
      );
    }

    if (id !== this.id) {
      return fail(
        `Parameter mismatch: Expected transactions for ${this.id} but received ${id}. This should never happen.`,
      );
    }

    if (maxConf < this.confirmationDepth) {
      return fail(
        `Configuration mismatch: Client confirmation depth (${this.confirmationDepth}) is larger than server (${maxConf}). Events will never be considered confirmed on the client.`,
      );
    }

    if (heartbeat > this.heartbeatTimeoutMs) {
      const newHeartbeatTimeoutMs = heartbeat + 2_500; // give a buffer of 2.5s

      this.emit(
        'warn',
        `Configuration mismatch: Client heartbeat interval (${this.heartbeatTimeoutMs}ms) is smaller than server heartbeat interval (${heartbeat}ms). Adapting to ${newHeartbeatTimeoutMs}ms to avoid reconnection loops.`,
      );

      this.heartbeatTimeoutMs = newHeartbeatTimeoutMs;
      this._resetHeartbeatTimeout(); // reset to the new interval
    }

    if (!isMajorCompatible(CLIENT_PROTOCOL_VERSION, serverProtocolVersion)) {
      return fail(
        `Protocol mismatch: Client protocol version ${CLIENT_PROTOCOL_VERSION} is incompatible with server protocol version ${serverProtocolVersion}.`,
      );
    }

    if (!isMinorCompatible(CLIENT_PROTOCOL_VERSION, serverProtocolVersion)) {
      if (isClientAhead(CLIENT_PROTOCOL_VERSION, serverProtocolVersion)) {
        this.emit(
          'warn',
          `Client protocol version ${CLIENT_PROTOCOL_VERSION} is ahead of server protocol version ${serverProtocolVersion}. Some client features may not be supported by the server.`,
        );
      } else {
        this.emit(
          'warn',
          `Server protocol version ${serverProtocolVersion} is ahead of client protocol version ${CLIENT_PROTOCOL_VERSION}. Some server features may not be supported by the client.`,
        );
      }
    }

    return true;
  }

  private _stopHeartbeatMonitor = (): void => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this._heartbeatTimer) {
      clearTimeout(this._heartbeatTimer);
    }
  };

  private _resetHeartbeatTimeout = (): void => {
    this._stopHeartbeatMonitor();
    this._heartbeatTimer = setTimeout(
      this._handleHeartbeatTimeout,
      this.heartbeatTimeoutMs,
    );
  };

  private _handleHeartbeatTimeout = (): void => {
    this._debug('_handleHeartbeatTimeout');
    this._handleError(new HeartbeatTimeoutError(this.heartbeatTimeoutMs));
  };

  private _makeConnectionURL(query?: string): string {
    const { host, type, id } = this;

    let path = `/stream/${type}/${id}`;

    // pass query string args. minHeight and limit for now.
    const urlParamArgs: string[][] = [];
    if (this.limit !== undefined) {
      urlParamArgs.push(['limit', String(this.limit)]);
    }
    // TODO This reconnection strategy of -3 from last max height
    // guarrantees that we will not miss events, but it also means
    // that confirmed transactions will be emitted more than once
    // Discussion here: https://github.com/kadena-community/kadena.js/issues/275
    if (this._lastHeight !== undefined) {
      urlParamArgs.push(['minHeight', String(this._lastHeight - 3)]);
    }
    if (urlParamArgs.length) {
      path += `?${new URLSearchParams(urlParamArgs).toString()}`;
    }
    return `${host}${path}`;
  }

  private _getTimeout(): number {
    return Math.pow(this._failedConnectionAttempts, 3) * 1000 + 100;
  }

  private _debug(caller: string, payload?: Partial<IDebugMsgObject>): void {
    const debugMsg: IDebugMsgObject = {
      ts: new Date().valueOf(),
      method: caller,
      ...payload,
    };
    this.emit('debug', debugMsg);
  }
}

export default ChainwebStream;
