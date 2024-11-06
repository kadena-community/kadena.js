import { useWalletState } from '../state/wallet';
import { Accounts } from './Accounts';
import { Transfer } from './Transfer';
import { Transfers } from './Transfers';
import { WordPhrase } from './WordPhrase';

export function Wallet() {
  // Initialize wallet with a password
  useWalletState('password');

  return (
    <div className="w-[800px] mx-auto">
      <WordPhrase />
      <Accounts />
      <Transfer />
      <Transfers />
    </div>
  );
}
