declare module 'ttys' {
  import { Readable, Writable } from 'stream';

  /**
   * Represents the standard input stream (stdin).
   */
  export const stdin: Readable;

  /**
   * Represents the standard output stream (stdout).
   */
  export const stdout: Writable;
}
