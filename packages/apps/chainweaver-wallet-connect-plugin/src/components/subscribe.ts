import { WalletKitTypes  } from '@reown/walletkit';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { IAccount } from './communicate';

export function subscribeToSessionProposal(walletKit: any, accounts: IAccount[], onSessionApproved: (session: any) => void) {

  async function onSessionProposal({ id, params }: WalletKitTypes.SessionProposal) {
    try {

      // TODO: get public key from accounts and populate supportedNamespaces
      // TODO: read requested chains from params


      // ------- namespaces builder util ------------ //
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          kadena: {
            chains: ['kadena:mainnet01', 'kadena:testnet04'],
            methods: ['kadena_getAccounts_v1', 'kadena_sign_v1', 'kadena_quicksign_v1'],
            events: [],
            accounts: [
              'kadena:mainnet01:38298612cc2d5e841a232bd08413aa5304f9ef3251575ee182345abc3807dd89',
              'kadena:testnet04:38298612cc2d5e841a232bd08413aa5304f9ef3251575ee182345abc3807dd89'
            ],
          },
        },
      });

      const session = await walletKit.approveSession({
        id,
        namespaces: approvedNamespaces,
      });

      console.log(session);
      onSessionApproved(session);
    } catch (error) {
      console.error(error);

      await walletKit.rejectSession({
        id: id,
        reason: getSdkError('USER_REJECTED'),
      });
    }
  }

  walletKit.on('session_proposal', onSessionProposal);

  return {
    unsubscribe: () => walletKit.off('session_proposal', onSessionProposal),
  };
}