import EventEmitter from 'eventemitter2';
import HeartbeatTimeoutError from './heartbeat-timeout-error.js';
import ConnectTimeoutError from './connect-timeout-error.js';
import {
  ChainwebStreamConstructorArgs,
  ChainwebStreamType,
  Transaction,
  ConnectionState,
  DebugMsgObject,
} from './types.js';

export * from './types.js';

// TODO confirmation depth should be sent from the backend
// so that it is always in sync with the client
const DEFAULT_CONFIRMATION_DEPTH: number = 6;
const DEFAULT_CONNECT_TIMEOUT: number = 25_000;
const DEFAULT_HEARTBEAT_TIMEOUT: number = 35_000;
const DEFAULT_MAX_RECONNECTS: number = 6;
const DEFAULT_LIMIT: number = 100;

class ChainwebStream extends EventEmitter {
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
  // TODO client <-> server should agree about this somehow, because of edge case:
  // if backend CONFIRMATION_DEPTH < client CONFIRMATION_DEPTH, then the client will not emit and confirmed events
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
    host,
    type,
    id,
    limit,
    connectTimeout,
    maxReconnects,
    heartbeatTimeout,
    confirmationDepth,
  }: ChainwebStreamConstructorArgs) {
    super();
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
    if (this._connectTimer) {
      clearTimeout(this._connectTimer);
    }
    this._connectTimer = setTimeout(
      () => this._handleError(new ConnectTimeoutError()),
      this.connectTimeoutMs,
    );
  };

  /**
   * Call to disconnect
   */
  public disconnect = (): void => {
    this._desiredState = ConnectionState.Closed;
    this._eventSource?.close();
    // TODO Should we null out this._eventSource?
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
    _eventSource.addEventListener('initial', this._handleData);
    _eventSource.addEventListener('message', this._handleData);
    _eventSource.addEventListener('ping', this._resetHeartbeatTimeout);
    this._resetHeartbeatTimeout();
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
    if (this._connectTimer) {
      clearTimeout(this._connectTimer);
    }

    let message = 'Connection error'; // default for "Event". No error information is available, presume disconnection
    if (err instanceof HeartbeatTimeoutError) {
      // special case: heartbeat timeout
      message = `Connection stale (no heartbeats for ${this.heartbeatTimeoutMs} ms)`;
    } else if (err instanceof ConnectTimeoutError) {
      // special case: initial connection timeout
      message = `Connection timeout (timeout ${this.connectTimeoutMs} ms)`;
    }

    const willRetry = this._failedConnectionAttempts < this.maxReconnects;
    const timeout = this._getTimeout();
    this._debug('_handleError', { message, willRetry, timeout });

    if (!willRetry) {
      this.emit('error', message); // TODO need to wrap in Error ?
      this._desiredState = ConnectionState.Closed;
      return;
    }

    this.emit('warn', message);
    this.emit('will-reconnect');

    this._desiredState = ConnectionState.WaitReconnect;
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
    }
    this._reconnectTimer = setTimeout(this.connect, timeout);
  };

  private _handleData = (msg: any): void => {
    // TODO fix any. MessageEvent fails for custom event (.addEventListener(initial))
    this._debug('_handleData', { length: msg.data?.length });

    const message = JSON.parse(msg.data) as Transaction | Transaction[];

    const data: Transaction[] = Array.isArray(message) ? message : [message];

    const newMinHeight = data.reduce(
      (highest, { height }) => (height > highest ? height : highest),
      0,
    );

    if (!this._lastHeight || newMinHeight > this._lastHeight) {
      this._lastHeight = newMinHeight;
    }

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

    this._resetHeartbeatTimeout();
  };

  private _stopHeartbeatMonitor = (): void => {
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
    this._handleError(new HeartbeatTimeoutError());
  };

  private _makeConnectionURL(query?: string): string {
    const { host, type, id } = this;

    let path = `/stream/${type}/${id}`;

    // pass query string args. minHeight and limit for now.
    const urlParamArgs: string[][] = [];
    if (this.limit !== undefined) {
      urlParamArgs.push(['limit', String(this.limit)]);
    }
    if (this._lastHeight !== undefined) {
      urlParamArgs.push(['minHeight', String(this._lastHeight)]);
    }
    if (urlParamArgs.length) {
      path += '?' + new URLSearchParams(urlParamArgs).toString();
    }
    return `${host}${path}`;
  }

  private _getTimeout(): number {
    return Math.pow(this._failedConnectionAttempts, 3) * 1000 + 100;
  }

  private _debug(caller: string, payload?: Record<string, any>): void {
    const debugMsg: DebugMsgObject = {
      ts: new Date().valueOf(),
      method: caller as any,
      ...payload,
    };
    this.emit('debug');
  }
}

export default ChainwebStream;
