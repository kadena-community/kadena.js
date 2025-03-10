import WalletKit, { WalletKitTypes } from '@reown/walletkit';
import Core from '@walletconnect/core';
import { useEffect, useState, useMemo, useRef } from 'react';
import { mainContainerClass } from '../style.css';
// import { subscribeToSessionProposal } from './subscribe';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { communicate, IAccount, INetwork } from './communicate';
import { AccountPrompt } from './AccountPrompt/AccountPrompt';

const core = new Core({
  projectId: '77ef30356b9964645f55fa54c3e83988',
});

const metadata = {
  name: 'Kadena Chainweaver v3',
  description: 'AppKit Example',
  url: 'http://localhost:4173/', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

interface KadenaAccount {
  name: string;
  contract: string;
  chains: number[];
}

interface AccountResponse {
  account: string;
  publicKey: string;
  kadenaAccounts: KadenaAccount[];
}

export const WalletConnect: React.FC<{
  sessionId: string;
  target: Window;
}> = ({ sessionId, target }) => {
  const [walletKit, setWalletKit] = useState<WalletKit | undefined>();
  const [uri, setUri] = useState<string>('');
  const [session, setSession] = useState<any>();
  const [activeSessions, setActiveSessions] = useState<Array<any>>([])
  const [networks, setNetworks] = useState<INetwork[]>([]);
  const [showAccountPrompt, setShowAccountPrompt] = useState<boolean>(false);
  const [availableAccounts, setAvailableAccounts] = useState<Array<IAccount>>([])
  const [selectedAccounts, setSelectedAccounts] = useState<Array<IAccount>>([])
  const [accountStore, setAccountStore] = useState<{ [id: string]: Array<{ name:string, account: IAccount, publicKey: string}> }>({});

  const message = useMemo(
    () => communicate(window, target, '@kadena/chainweaver-pact-console-plugin', sessionId),
    [sessionId, target],
  );

   // Refs to track latest state
   const networksRef = useRef(networks);
   const walletKitRef = useRef(walletKit);
   const selectedAccountsRef = useRef(selectedAccounts);
   const accountStoreRef = useRef(accountStore);

   // Sync state to refs
   useEffect(() => {
     networksRef.current = networks;
     walletKitRef.current = walletKit;
     selectedAccountsRef.current = selectedAccounts;
     accountStoreRef.current = accountStore;
   }, [networks, walletKit, selectedAccounts, accountStore]);

  useEffect(() => {
    const storedAccounts = localStorage.getItem('accountStore');
    if (storedAccounts) {
      setAccountStore(JSON.parse(storedAccounts));
    }
    async function initWalletKit() {
      if (!walletKit) {
        const newWalletKit = await WalletKit.init({
          core, // <- pass the shared 'core' instance
          metadata,
        });
        setWalletKit(newWalletKit);
        newWalletKit.on('session_proposal', onSessionProposal);
        newWalletKit.on('session_request', handleSessionRequest);
      }
    }
    async function networkList() {
      const response = await message('GET_NETWORK_LIST');
      setNetworks(response.payload as INetwork[]);
    }
    initWalletKit();
    networkList();
  }, []);

  useEffect(() => {
    localStorage.setItem('accountStore', JSON.stringify(accountStore));
  }, [accountStore]);


  // TODO: find a more solid way to solve this
  function deriveKeyFromAccount(account: IAccount) {
    const key = account.guard.keys[0];
    return key;
  }

  async function onSessionProposal({ id, params }: WalletKitTypes.SessionProposal){
    const currentWalletKit = walletKitRef.current;
    const currentNetworks = networksRef.current;
    const currentSelectedAccounts = selectedAccountsRef.current;

    if (!currentWalletKit) return;

    try {
      const accountStoreEntry: Array<{ name:string, account: IAccount, publicKey: string}> = [];
      const chains = currentNetworks.map(network => `kadena:${network.networkId}`);
      const approvedAccounts = Array.from( new Set( currentNetworks.flatMap((network) =>
        currentSelectedAccounts.map((account) => {
          const publicKey = deriveKeyFromAccount(account);
          const name = `kadena:${network.networkId}:${publicKey}`;
          accountStoreEntry.push({ name, account, publicKey });
          return name;
        })))
      );

      // ------- namespaces builder util ------------ //
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          kadena: {
            chains,
            methods: ['kadena_getAccounts_v1', 'kadena_sign_v1', 'kadena_quicksign_v1'],
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
      setAccountStore({ ...accountStoreRef.current, [session.topic]: accountStoreEntry});
      console.log(accountStoreRef.current);
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
    const request = sessionRequest.params.request
    const { id, topic } = sessionRequest
    const { params, method } = request

    const currentWalletKit = walletKitRef.current;

    if (!currentWalletKit) throw new Error('WalletKit not found');

    try {
      if (method === 'kadena_getAccounts_v1') {
        // Get accounts requested by the request
        // const requestedAccountsArray = params.accounts;
        const requestedAccountsArray = [params]; // Temp to support demo app that doesn't conform to the spec

        let storedAccounts = accountStoreRef.current[topic];
        if (!storedAccounts) {
          // Handle case where no accounts are found for the given topic/session
          console.warn('No accounts found for topic', topic);
          await currentWalletKit.respondSessionRequest({
            topic,
            response: {
              id,
              jsonrpc: '2.0',
              error: getSdkError('UNSUPPORTED_ACCOUNTS')
            }
          });
          return;
        }

        const accountsResponse = requestedAccountsArray.map((requestedAccount: { account: string, contracts: string[] }) => {
          return storedAccounts.filter(storedAccount => {
            return requestedAccount.account === storedAccount.name && (requestedAccount.contracts.length === 0 || requestedAccount.contracts.includes(storedAccount.account.contract));
          }).map(acc => {
            return {
              account: acc.name,
              publicKey: acc.publicKey,
              kadenaAccounts: [{
                name: acc.account.address,
                contract: acc.account.contract,
                chains: acc.account.chains.map(chain => chain.chainId)
              }]
            };
          }).reduce((result: AccountResponse | null, curr: AccountResponse) => {
            if (!result) {
              result = curr;
            } else {
              result.kadenaAccounts = [...result.kadenaAccounts, ...curr.kadenaAccounts];
            }
            return result;
          }, null);
        })

        await currentWalletKit.respondSessionRequest({
          topic,
          response: {
            id,
            jsonrpc: '2.0',
            result: {
              accounts: accountsResponse
            }
          }
        });
      } else if (method === 'kadena_sign_v1') {
        console.log(params);

        //const signingRequest = params;
        const response = await message('SIGN_REQUEST');
        console.log(response);

      } else if (method === 'kadena_quicksign_v1') {
        console.log(params);
      } else {
        console.warn(`Unhandled method: ${method}`);
        await currentWalletKit.respondSessionRequest({
          topic,
          response: {
            id,
            jsonrpc: '2.0',
            error: getSdkError('INVALID_METHOD')
          }
        });
      }
    } catch (error) {
      console.log(error)
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
    console.log(selectedAccounts);
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

    await getActiveSessions();
    setSession(undefined);
  }

  async function getActiveSessions() {
    if (!walletKit) throw Error('WalletKit instance is undefined');

    const activeSessions = await walletKit.getActiveSessions();
    console.log('active sessions', activeSessions);
    setActiveSessions(Object.values(activeSessions))
  }

  return <div className={mainContainerClass}>
    <input type="text" placeholder='WalletConnect URI' onChange={(e) => setUri(e.target.value)} value={uri} />
    <button onClick={handleConnect} disabled={!uri}>Accept Request</button>
    <button onClick={getActiveSessions}>Get Active Sessions</button>

    {activeSessions.length > 0 && <h2>Active Sessions</h2>}
    {activeSessions?.map(session => (
      <div key={session.topic}>
        <p>{session.peer.metadata.name} - {session.topic}</p>
        <button onClick={() => setSession(session)}>Set Session</button>
      </div>
    ))}
    {session &&
      <div>
        <h2>Session Details</h2>
        <div>session topic: {session.topic}</div>
        <div>Accounts: {session.namespaces['kadena'].accounts.map((a: string) => <p>{a}</p>)}</div>
        <div>Connected to: {session.peer.metadata.name}</div>
        <button onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>
    }
    {showAccountPrompt &&<AccountPrompt accounts={availableAccounts} onAccountsSelected={onAccountsSelected} />}
    <p>Plugin Session Id: { sessionId }</p>
  </div>
};
