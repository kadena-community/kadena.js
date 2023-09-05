import type { IBufferHeader } from './types';

export class HeaderBuffer {
  public depth: number;
  public callback: (header: IBufferHeader) => void;
  public currHeight: number | undefined;
  public buffer: IBufferHeader[];

  public constructor(depth: number, callback: (header: IBufferHeader) => void) {
    /* The depth at which blocks are released */
    this.depth = depth;
    this.callback = callback;

    /* NOTE, that the element at index 0 is one block deeper than the release
     * depth. It is kept for one additional step in the buffer in order to verify
     * the consistency of the stream when depth is 0
     */

    /* block height at index 0 */

    this.currHeight = undefined;
    this.buffer = [];
  }

  public add(u: IBufferHeader): void {
    const hdr = u.header;
    const h = hdr.height;

    // Empty buffer
    if (this.currHeight === undefined) {
      this.buffer[0] = {
        txCount: 0,
        header: {
          hash: hdr.parent,
          nonce: '',
          creationTime: 0,
          parent: '',
          adjacents: {},
          target: '',
          payloadHash: '',
          chainId: 0,
          weight: '',
          height: 0,
          chainwebVersion: '',
          epochStart: 0,
          featureFlags: 0,
        },
        powHash: '',
        target: '',
      };
      this.buffer[1] = u;
      this.currHeight = h - 1;
    } else if (h <= this.currHeight) {
      // It is an orpaned block
      throw new Error(
        `HeaderBuffer: confirmation depth violation: block at height ${h} got orphaned`,
      );
    } else {
      // place item into buffer
      const idx = h - this.currHeight;

      const prevHash = this.buffer[idx - 1].header.hash;
      if (hdr.parent !== prevHash) {
        throw new Error(
          `HeaderBuffer: inconsistent chain at height ${h}. Parent ${prevHash} doesn't match expected value ${hdr.parent}`,
        );
      }

      this.buffer[idx] = u;
    }

    // shift and call callback
    while (this.buffer.length - 1 > this.depth) {
      this.buffer.shift();
      const b = this.buffer[0];
      this.currHeight += 1;
      if (b !== undefined && b !== null) {
        this.callback(b);
      } else {
        throw new Error(
          `HeaderBuffer: missing block at height ${this.currHeight}`,
        );
      }
    }
  }
}
