import { useWalletState } from '../state/wallet';
import { Accounts } from './Accounts';
import { KadenaNamesRegister } from './KadenaNamesRegister';
import { KadenaNames } from './KadenaNamesResolver';
import { Transfer } from './Transfer';
import { Transfers } from './Transfers';
import { WordPhrase } from './WordPhrase';

export function Wallet() {
  // Initialize wallet with a password
  useWalletState('password');

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6">
      {/* Header */}
      <header className="bg-dark-slate text-white p-4 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-center text-primary-green">
          WalletSDK TestWallet
        </h1>
      </header>

      {/* Main Components */}
      <div className="space-y-8">
        <WordPhrase />
        <Accounts />
        <Transfer />
        <Transfers />
        <KadenaNames />
        <KadenaNamesRegister />
      </div>
    </div>
  );
}
