import { WalletKitTypes } from '@reown/walletkit';
import { useEffect, useMemo, useRef, useState } from 'react';
import { mainContainerClass } from './style.css';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { AccountPrompt } from '../AccountPrompt/AccountPrompt';
import useAccountStore from '../../hooks/useAccountStore';
import useWalletKit from '../../hooks/useWalletKit';
import { handleGetAccountsV1, handleSignV1, handleQuickSignV1 } from '../../handlers';
import { communicate, IAccount, INetwork } from '../../wallet-communication';

export const WalletConnect: React.FC<{
  sessionId: string;
  target: Window;
}> = ({ sessionId, target }) => {
  const [uri, setUri] = useState<string>('');
  const [session, setSession] = useState<any>();
  const [activeSessions, setActiveSessions] = useState<Array<any>>([]);
  const [networks, setNetworks] = useState<INetwork[]>([]);
  const [showAccountPrompt, setShowAccountPrompt] = useState<boolean>(false);
  const [availableAccounts, setAvailableAccounts] = useState<Array<IAccount>>(
    [],
  );
  const [selectedAccounts, setSelectedAccounts] = useState<Array<IAccount>>([]);
  const [accountStore, setAccountStore, accountStoreRef] = useAccountStore();
  const [walletKit, walletKitRef] = useWalletKit(onSessionProposal, handleSessionRequest);

  const message = useMemo(
    () =>
      communicate(
        window,
        target,
        '@kadena/chainweaver-wallet-connect-plugin',
        sessionId,
      ),
    [sessionId, target],
  );

  // Refs to track latest state
  const networksRef = useRef(networks);
  const selectedAccountsRef = useRef(selectedAccounts);

  // Sync state to refs
  useEffect(() => {
    networksRef.current = networks;
    selectedAccountsRef.current = selectedAccounts;
  }, [networks, selectedAccounts]);

  // Fetch the network list
  useEffect(() => {
    const fetchNetworkList = async () => {
      const response = await message('GET_NETWORK_LIST');
      setNetworks(response.payload as INetwork[]);
    };
    fetchNetworkList();
  }, []);

  // TODO: find a more solid way to solve this
  function deriveKeyFromAccount(account: IAccount) {
    const key = account.guard.keys[0];
    return key;
  }

  async function onSessionProposal({
    id,
    params,
  }: WalletKitTypes.SessionProposal) {
    const currentWalletKit = walletKitRef.current;
    const currentNetworks = networksRef.current;
    const currentSelectedAccounts = selectedAccountsRef.current;

    if (!currentWalletKit) return;

    try {
      const accountStoreEntry: Array<{
        name: string;
        account: IAccount;
        publicKey: string;
      }> = [];
      const chains = currentNetworks.map(
        (network) => `kadena:${network.networkId}`,
      );
      const approvedAccounts = Array.from(
        new Set(
          currentNetworks.flatMap((network) =>
            currentSelectedAccounts.map((account) => {
              const publicKey = deriveKeyFromAccount(account);
              const name = `kadena:${network.networkId}:${publicKey}`;
              accountStoreEntry.push({ name, account, publicKey });
              return name;
            }),
          ),
        ),
      );

      // Build namespaces
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          kadena: {
            chains,
            methods: [
              'kadena_getAccounts_v1',
              'kadena_sign_v1',
              'kadena_quicksign_v1',
            ],
            events: [],
            accounts: approvedAccounts,
          },
        },
      });

      const session = await currentWalletKit.approveSession({
        id,
        namespaces: approvedNamespaces,
      });

      // Store selected accounts in accounts store
      setAccountStore({
        ...accountStoreRef.current,
        [session.topic]: accountStoreEntry,
      });
      setSession(session);
    } catch (error) {
      console.error(error);

      await currentWalletKit.rejectSession({
        id: id,
        reason: getSdkError('USER_REJECTED'),
      });
    }
  }

  async function handleSessionRequest(sessionRequest: any) {
    const request = sessionRequest.params.request;
    const { id, topic } = sessionRequest;
    const { method } = request;

    const currentWalletKit = walletKitRef.current;

    if (!currentWalletKit) throw new Error('WalletKit not found');

    try {
      switch (method) {
        case 'kadena_getAccounts_v1':
          await handleGetAccountsV1(request, sessionRequest, currentWalletKit, accountStoreRef.current);
          break;
        case 'kadena_sign_v1':
          await handleSignV1(sessionRequest, currentWalletKit);
          break;
        case 'kadena_quicksign_v1':
          await handleQuickSignV1(request, sessionRequest, currentWalletKit, message);
          break;
        default:
          console.warn(`Unhandled method: ${method}`);
          await currentWalletKit.respondSessionRequest({
            topic,
            response: {
              id,
              jsonrpc: '2.0',
              error: getSdkError('INVALID_METHOD'),
            },
          });
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleConnect() {
    if (!walletKit) throw Error('WalletKit instance is undefined');
    if (!uri) throw Error('WC URI is undefined');

    // Get available accounts
    const response = await message('GET_ACCOUNTS');
    setAvailableAccounts(response.payload as IAccount[]);
    setShowAccountPrompt(true);
  }

  async function onAccountsSelected(accounts: IAccount[]) {
    setSelectedAccounts(accounts);
    setShowAccountPrompt(false);
    if (accounts.length === 0) {
      console.log('Rejecting request');
    } else {
      await walletKit?.pair({ uri });
    }
  }

  async function handleDisconnect() {
    if (!walletKit) throw Error('WalletKit instance is undefined');
    if (!session) throw Error('Session is undefined');

    await walletKit.disconnectSession({
      topic: session.topic,
      reason: getSdkError('USER_DISCONNECTED'),
    });

    const { [session.topic]: _, ...filteredAccountStore } = accountStore;
    setAccountStore(filteredAccountStore);
    await getActiveSessions();
    setSession(undefined);
  }

  async function getActiveSessions() {
    if (!walletKit) throw Error('WalletKit instance is undefined');

    const activeSessions = await walletKit.getActiveSessions();
    setActiveSessions(Object.values(activeSessions));
  }

  return (
    <div className={mainContainerClass}>
      <input
        type="text"
        placeholder="WalletConnect URI"
        onChange={(e) => setUri(e.target.value)}
        value={uri}
      />
      <button onClick={handleConnect} disabled={!uri}>
        Accept Request
      </button>
      <button onClick={getActiveSessions}>Get Active Sessions</button>

      {activeSessions.length > 0 && <h2>Active Sessions</h2>}
      {activeSessions?.map((session) => (
        <div key={session.topic}>
          <p>
            {session.peer.metadata.name} - {session.topic}
          </p>
          <button onClick={() => setSession(session)}>Set Session</button>
        </div>
      ))}
      {session && (
        <div>
          <h2>Session Details</h2>
          <div>session topic: {session.topic}</div>
          <div>
            Accounts:{' '}
            {session.namespaces['kadena'].accounts.map((a: string) => (
              <p>{a}</p>
            ))}
          </div>
          <div>Connected to: {session.peer.metadata.name}</div>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      )}
      {showAccountPrompt && (
        <AccountPrompt
          accounts={availableAccounts}
          onAccountsSelected={onAccountsSelected}
        />
      )}
      <p>Plugin Session Id: {sessionId}</p>
    </div>
  );
};
