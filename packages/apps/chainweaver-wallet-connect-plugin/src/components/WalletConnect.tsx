import WalletKit from '@reown/walletkit';
import Core from '@walletconnect/core';
import { useEffect, useState, useMemo } from 'react';
import { mainContainerClass } from '../style.css';
import { subscribeToSessionProposal } from './subscribe';
import { getSdkError } from '@walletconnect/utils';
import { communicate, IAccount } from './communicate';
import { AccountPrompt } from './AccountPrompt/AccountPrompt';

const core = new Core({
  projectId: '1d8fe1e80daaaf10e5e793df2bffdaab',
});

const metadata = {
  name: 'Kadena Chainweaver v3',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

export const WalletConnect: React.FC<{
  sessionId: string;
  target: Window;
}> = ({ sessionId, target }) => {
  const [walletKit, setWalletKit] = useState<any | undefined>();
  const [uri, setUri] = useState<string>('');
  const [session, setSession] = useState<any>();
  const [activeSessions, setActiveSessions] = useState<Array<any>>([])
  const [showAccountPrompt, setShowAccountPrompt] = useState<boolean>(false);
  const [availableAccounts, setAvailableAccounts] = useState<Array<IAccount>>([])
  const [selectedAccounts, setSelectedAccounts] = useState<Array<IAccount>>([])

  const message = useMemo(
    () => communicate(window, target, '@kadena/chainweaver-pact-console-plugin', sessionId),
    [sessionId, target],
  );

  useEffect(() => {
    async function initWalletKit() {
      if (!walletKit) {
        const newWalletKit = await WalletKit.init({
          core, // <- pass the shared 'core' instance
          metadata,
        });
        setWalletKit(newWalletKit);
      }
    }
    initWalletKit();
  }, []);

  async function handleConnect() {
    if (!walletKit) throw Error('WalletKit instance is undefined');
    if (!uri) throw Error('Reown URI is undefined');

    // Get available accounts
    const response = await message('GET_ACCOUNTS');
    setAvailableAccounts(response.payload);
    setShowAccountPrompt(true);
  }

  async function onAccountsSelected(accounts: IAccount[]) {
    setSelectedAccounts(accounts);
    setShowAccountPrompt(false);
    if (accounts.length === 0) {
      console.log('Rejecting request');
    } else {
      subscribeToSessionProposal(walletKit, accounts, (s) => setSession(s));
      await walletKit.pair({ uri });
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
