// ecko has no types, so this kadena object is as found in the ecko repo.
export type IECKOWindow = Window &
  typeof globalThis & {
    kadena: {
      isKadena: boolean;
      on: (name: string, callback: () => {}) => Promise<any>;
      request: (options: {
        method:
          | 'kda_connect'
          | 'kda_disconnect'
          | 'kda_checkStatus'
          | 'kda_checkIsConnected'
          | 'kda_getNetwork'
          | 'kda_getChain'
          | 'kda_getSelectedAccount'
          | 'kda_requestAccount'
          | 'kda_requestSign'
          | 'kda_requestQuickSign'
          | 'kda_sendKadena';
        networkId: string;
        data?: any;
      }) => Promise<any>;
    };
  };

export interface IEckoConnectResult {
  message: 'string';
  status: 'success' | 'fail';
  account: {
    account: null | string;
    publicKey: null | string;
  };
}
