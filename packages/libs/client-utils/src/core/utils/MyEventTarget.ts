import type { Any } from './types';

// the default EventTarget does not throw errors when dispatching events
// also the default EventTarget does not support async event listeners
export class MyEventTarget {
  private _listeners: Record<string, ((data: Any) => void | Promise<void>)[]> =
    {};

  public addEventListener(
    event: string,
    cb: (event: Any) => void | Promise<void>,
  ) {
    if (cb === undefined) {
      throw new Error('cb is undefined');
    }
    this._listeners[event] ??= [];
    this._listeners[event].push(cb);
  }

  public async dispatchEvent(event: string, data: Any) {
    await Promise.all(
      [...(this._listeners[event] ?? [])].map((cb) => cb(data)),
    );
  }

  public removeEventListener(
    event: string,
    cb: (event: Any) => void | Promise<void>,
  ) {
    this._listeners[event] = (this._listeners[event] ?? []).filter(
      (listener) => listener !== cb,
    );
  }
}
