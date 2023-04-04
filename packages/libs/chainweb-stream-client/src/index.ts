import EventEmitter from 'eventemitter2';
import HeartbeatTimeoutError from './heartbeat-timeout-error.js';
import {
  IChainwebStreamConstructorArgs,
  ChainwebStreamType,
  GenericData,
  ConnectionState,
} from './types.js';

export * from './types.js';

const CONFIRMATION_DEPTH: number = 6;
const HEARTBEAT_TIMEOUT: number = 35_000;
const MAX_RECONNECTS: number = 6;

class ChainwebStream extends EventEmitter {
  public host: string; // chainweb-stream backend host, full URI - e.g. https://sse.chainweb.com
  public type: ChainwebStreamType;
  public id: string;
  public limit: number | undefined;

  private _desiredState: ConnectionState = ConnectionState.None; // desired eventsource state
  // TODO the "WaitReconnect" state is currently stored in desiredState. Is this correct design-wise?

  private _eventSource?: EventSource;
  private _lastHeight?: number; // last tracked height, used for resuming gracefully
  private _failedConnectionAttempts: number = 0; // counter for failed connection attempts; used for exponential backoff
  private _totalConnectionAttempts: number = 0;
  private _heartbeatTimeout?: ReturnType<typeof setTimeout>;
  private _reconnectTimeout?: ReturnType<typeof setTimeout>;

  public constructor({
    host,
    type,
    id,
    limit,
  }: IChainwebStreamConstructorArgs) {
    super();
    this.type = type;
    this.id = id;
    this.host = host.endsWith('/') ? host.substr(0, host.length - 1) : host; // strip trailing slash if provided
    if (limit !== undefined) {
      this.limit = limit;
    }
  }

  public connect(): void {
    this._desiredState = ConnectionState.Connected;
    this._eventSource = new EventSource(this._makeConnectionURL());
    this._eventSource.onopen = this._handleConnect;
    this._eventSource.onerror = this._handleError;
    this._debug('connect');
  }

  public disconnect(): void {
    this._desiredState = ConnectionState.Closed;
    this._eventSource?.close();
    // TODO Should we null out this._eventSource?
    this._stopHeartbeatMonitor();
    this._debug('disconnect');
  }

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
    } = this;
    this._debug('_handleConnect', { consecutiveFailedAttempts, totalAttempts });
    this._failedConnectionAttempts = 0;
    const { _eventSource } = this;
    if (!_eventSource) {
      throw new Error(
        'ChainwebStream._handleConnect called without an _eventSource. This should never happen',
      );
    }
    _eventSource.addEventListener('initial', this._handleData);
    _eventSource.addEventListener('message', this._handleData);
    _eventSource.addEventListener('ping', this._resetHeartbeatTimeout);
    this._resetHeartbeatTimeout();
    if (this._totalConnectionAttempts) {
      this.emit('reconnect');
    } else {
      this.emit('connect');
    }
    this._totalConnectionAttempts += 1;
  };

  /*
   * Chrome has different reconnecting strategy (some) vs Firefox (none)
   * so we disable reconnections and handle them manually
   */
  private _handleError = (err: HeartbeatTimeoutError | Event): void => {
    this._failedConnectionAttempts += 1;
    this._eventSource?.close();
    const message =
      err instanceof HeartbeatTimeoutError
        ? `Connection stale (no heartbeats for ${HEARTBEAT_TIMEOUT} ms)`
        : 'Connection error';
    const willRetry = this._failedConnectionAttempts < MAX_RECONNECTS;
    const timeout = this._getTimeout();
    this._debug('_handleError', { message, willRetry, timeout });
    if (!willRetry) {
      this.emit('error', message); // TODO need to wrap in Error ?
      this._desiredState = ConnectionState.Closed;
      return;
    }
    this.emit('warn', message);
    this.emit('will-reconnect', message);
    this._desiredState = ConnectionState.WaitReconnect;
    if (this._reconnectTimeout) {
      clearTimeout(this._reconnectTimeout);
      this._reconnectTimeout = setTimeout(this.connect, timeout);
    }
  };

  private _handleData = (msg: any): void => {
    // TODO warning any
    this._debug('_handleData', { length: msg.data?.length });

    const message = JSON.parse(msg.data) as GenericData | GenericData[];

    const data: GenericData[] = Array.isArray(message) ? message : [message];

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
      if (confirmations >= CONFIRMATION_DEPTH) {
        this.emit('confirmed', element);
      } else {
        this.emit('unconfirmed', element);
      }
    }

    this._resetHeartbeatTimeout();
  };

  private _stopHeartbeatMonitor = (): void => {
    if (this._heartbeatTimeout) {
      clearTimeout(this._heartbeatTimeout);
    }
  };

  private _resetHeartbeatTimeout = (): void => {
    this._debug('_resetHeartbeatTimeout');
    this._stopHeartbeatMonitor();
    this._heartbeatTimeout = setTimeout(
      this._handleHeartbeatTimeout,
      HEARTBEAT_TIMEOUT,
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
    this.emit('debug', { ts: new Date(), method: caller, ...payload });
  }
}

export default ChainwebStream;
