import { describe, expect, it, vi } from 'vitest';

import { MyEventTarget } from '../MyEventTarget';

describe('MyEventTarget', () => {
  it("dispatches the event to the event's listeners", async () => {
    const emitter = new MyEventTarget();
    const cb = vi.fn();
    emitter.addEventListener('test', cb);
    await emitter.dispatchEvent('test', 'data');
    emitter.removeEventListener('test', cb);
    expect(cb).toHaveBeenCalledWith('data');
  });

  it("throws an error when the event's listener throws an error", async () => {
    const emitter = new MyEventTarget();
    const cb = vi.fn(() => {
      throw new Error('test');
    });
    emitter.addEventListener('test', cb);
    await expect(emitter.dispatchEvent('test', 'data')).rejects.toThrow(
      new Error('test'),
    );
  });

  it('throws an error if callback is undefined', async () => {
    const emitter = new MyEventTarget();
    expect(() => emitter.addEventListener('test', undefined as any)).toThrow(
      new Error('cb is undefined'),
    );
  });
});
