import { useState } from 'react';
import { useWalletState } from '../state/wallet';
import { Accounts } from './Accounts';
import { KadenaNamesRegister } from './kadenaNames/KadenaNamesRegister';
import { KadenaNames } from './kadenaNames/KadenaNamesResolver';
import { Transfer } from './Transfer';
import { Transfers } from './Transfers';
import { WordPhrase } from './WordPhrase';

type AccordionState = {
  [key: string]: boolean;
};

export function Wallet() {
  useWalletState('password');

  const [openSections, setOpenSections] = useState<AccordionState>({
    wordPhrase: true,
    accounts: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6">
      <header className="bg-dark-slate text-white p-4 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-center text-primary-green">
          WalletSDK TestWallet
        </h1>
      </header>

      <div className="space-y-4">
        {/* WordPhrase Section */}
        <AccordionSection
          title="Word Phrase"
          isOpen={openSections.wordPhrase}
          onClick={() => toggleSection('wordPhrase')}
        >
          <WordPhrase />
        </AccordionSection>

        {/* Accounts Section */}
        <AccordionSection
          title="Accounts"
          isOpen={openSections.accounts}
          onClick={() => toggleSection('accounts')}
        >
          <Accounts />
        </AccordionSection>

        {/* Transfer Section */}
        <AccordionSection
          title="Transfer"
          isOpen={openSections.transfer}
          onClick={() => toggleSection('transfer')}
        >
          <Transfer toggle={() => toggleSection('transfers')} />
        </AccordionSection>

        {/* Transfers Section */}
        <AccordionSection
          title="Transfers"
          isOpen={openSections.transfers}
          onClick={() => toggleSection('transfers')}
        >
          <Transfers />
        </AccordionSection>

        {/* Kadena Names Section */}
        <AccordionSection
          title="Kadena Names"
          isOpen={openSections.kadenaNames}
          onClick={() => toggleSection('kadenaNames')}
        >
          <KadenaNames />
        </AccordionSection>

        {/* Kadena Names Register Section */}
        <AccordionSection
          title="Kadena Names Register"
          isOpen={openSections.kadenaNamesRegister}
          onClick={() => toggleSection('kadenaNamesRegister')}
        >
          <KadenaNamesRegister />
        </AccordionSection>
      </div>
    </div>
  );
}

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

function AccordionSection({
  title,
  children,
  isOpen,
  onClick,
}: AccordionSectionProps) {
  return (
    <div className={`${isOpen ? 'border-b border-border-gray' : ''}`}>
      <button
        onClick={onClick}
        style={{
          backgroundColor: 'var(--medium-slate)',
          color: 'var(--text-color)',
        }}
        className="w-full text-left p-4 font-bold flex justify-between items-center rounded-md"
      >
        {title}
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      <div
        className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        {isOpen && <div className="p-4">{children}</div>}
      </div>
    </div>
  );
}
