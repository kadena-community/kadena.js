export class HeartbeatTimeoutError extends Error {
  private _heartbeatTimeoutMs: number;

  public constructor(heartbeatTimeoutMs: number) {
    super();
    this._heartbeatTimeoutMs = heartbeatTimeoutMs;
  }

  public toString(): string {
    return `Connection stale (no heartbeats for ${this._heartbeatTimeoutMs} ms)`;
  }
}

export class ConnectTimeoutError extends Error {
  private _connectTimeoutMs: number;

  public constructor(connectTimeoutMs: number) {
    super();
    this._connectTimeoutMs = connectTimeoutMs;
  }

  public toString(): string {
    return `Connection timeout (${this._connectTimeoutMs} ms)`;
  }
}

export const parseError = (
  err: HeartbeatTimeoutError | ConnectTimeoutError | Event,
): string => {
  if (
    err instanceof HeartbeatTimeoutError ||
    err instanceof ConnectTimeoutError
  ) {
    return err.toString();
  }

  return 'Connection error';
};
