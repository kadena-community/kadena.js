import { useWalletState } from '../state/wallet';
import { AccordionSection } from './Accordion';
import { Accounts } from './Accounts';
import { KadenaNamesRegister } from './kadenaNames/KadenaNamesRegister';
import { KadenaNames } from './kadenaNames/KadenaNamesResolver';
import { Transfer } from './Transfer';
import { Transfers } from './Transfers';
import { WordPhrase } from './WordPhrase';

export function Wallet() {
  useWalletState('password');

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6">
      <header className="bg-dark-slate text-white p-4 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-center text-primary-green">
          WalletSDK TestWallet
        </h1>
      </header>

      <div className="space-y-4">
        <AccordionSection title="Word Phrase" defaultOpen>
          <WordPhrase />
        </AccordionSection>

        <AccordionSection title="Accounts" defaultOpen>
          <Accounts />
        </AccordionSection>

        <AccordionSection title="Transfer">
          <Transfer />
        </AccordionSection>

        <AccordionSection title="Transfers">
          <Transfers />
        </AccordionSection>

        <AccordionSection title="Kadena Names">
          <KadenaNames />
        </AccordionSection>

        <AccordionSection title="Kadena Names Register">
          <KadenaNamesRegister />
        </AccordionSection>
      </div>
    </div>
  );
}
