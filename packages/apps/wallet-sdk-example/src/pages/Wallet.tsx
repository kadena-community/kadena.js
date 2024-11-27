import { Divider } from '@kadena/kode-ui';
import { Accounts } from '../components/Accounts';
import { WordPhrase } from '../components/WordPhrase';
import { useWalletState } from '../state/wallet';

export function Wallet() {
  useWalletState('password');

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6">
      <WordPhrase />
      <Divider />
      <Accounts />
    </div>
  );
}
