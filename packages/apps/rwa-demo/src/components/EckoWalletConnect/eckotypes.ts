export type IECKOWindow = Window &
  typeof globalThis & {
    kadena: any;
  };

export interface IEckoConnectResult {
  message: 'string';
  status: 'success' | 'fail';
  account: {
    account: null | string;
    publicKey: null | string;
  };
}
