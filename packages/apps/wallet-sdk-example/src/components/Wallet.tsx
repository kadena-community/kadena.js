import { Divider } from '@kadena/kode-ui';
import { useWalletState } from '../state/wallet';
import { Accounts } from './Accounts';
import { WordPhrase } from './WordPhrase';

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
