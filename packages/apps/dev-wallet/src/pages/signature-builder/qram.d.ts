type Timer = {
  start(): void;
  cancel(): void;
  nextFrame(): Promise<void>;
};
declare module 'qram' {
  export class Encoder {
    constructor({ data: Uint8Array, blockSize: number });
    createTimer({ fps: number }): Timer;
    createReadableStream(): Promise<ReadableStream>;
  }
  export class Decoder {
    constructor();
    decode(): Promise<any>;
    enqueue(data: Uint8Array): Promise<any>;
    cancel(): void;
  }
  export function decode(str: string): string;
  export function getImageData(x: any): ImageData;
}
