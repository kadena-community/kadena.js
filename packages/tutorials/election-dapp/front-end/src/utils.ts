import { poll } from '@kadena/chainweb-node-client';

const delay = (millis: number) => new Promise<void>(resolve => {
  setTimeout(() => resolve(), millis)
})
