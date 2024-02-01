import { Buffer as BufferJs } from 'buffer/';

if (typeof window !== 'undefined') {
  if (typeof window.Buffer === 'undefined') {
    (window as any).Buffer = BufferJs;
  }
}
