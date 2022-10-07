export * from './api/attachSignature';
export * from './api/createCommand';
export * from './api/createContCommand';
export * from './api/createExecCommand';
export * from './api/createListenRequest';
export * from './api/createPollRequest';
export * from './api/createSendRequest';
export * from './api/prepareContCommand';
export * from './api/prepareExecCommand';
export * from './api/pullAndCheckHashs';
export * from './api/pullSignature';
export * from './api/pullSigner';
export * from './wallet/createCap';

export function message(msg: string): string {
  return `Hello, ${msg}!`;
}
