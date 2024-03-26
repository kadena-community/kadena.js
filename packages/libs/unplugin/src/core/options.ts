import type { PactToolboxClient } from '@kadena/toolbox/client';

export interface Options {
  onReady?: (runtime: PactToolboxClient) => Promise<void>;
  startNetwork?: boolean;
}
