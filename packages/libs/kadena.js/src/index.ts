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
export * from './fetch/listen';
export * from './fetch/local';
export * from './fetch/parseResponse';
export * from './fetch/parseResponseTEXT';
export * from './fetch/poll';
export * from './fetch/send';
export * from './fetch/spv';
export * from './fetch/stringifyAndMakePOSTRequest';
export * from './lang/createExp';
export * from './SigData/mkCap';
export * from './util/PactValue';
export * from './util/unique';
export * from './wallet/createCap';

export function message(msg: string): string {
  return `Hello, ${msg}!`;
}
