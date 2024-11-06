import { useWalletState } from '../state/wallet';
import { useMnemonicWords } from '../state/words';

export const WordPhrase = () => {
  const wallet = useWalletState();
  const { mnemonicWords, setMnemonicWords } = useMnemonicWords();

  const onGenerateMnemonic = () => {
    const words = wallet.generateMnemonic();
    setMnemonicWords(words);
    wallet.changeMnemonicWords(words).catch(console.error);
  };

  const onChangeMnemonic = (words: string) => {
    if (mnemonicWords === words) return;
    setMnemonicWords(words);
    wallet.changeMnemonicWords(words).catch(console.error);
  };

  return (
    <div className="bg-dark-slate p-6 rounded-lg shadow-md w-full mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Word Phrase</h3>
      <div className="flex flex-col gap-4">
        <input
          name="mnemonic_phrase"
          defaultValue={mnemonicWords ?? ''}
          onBlur={(e) => onChangeMnemonic(e.target.value)}
          placeholder="Enter or generate mnemonic phrase"
          className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
        />
        <button
          onClick={onGenerateMnemonic}
          className="bg-primary-green text-white font-semibold rounded-md py-2 px-4 hover:bg-secondary-green transition w-full"
        >
          Generate Random
        </button>
      </div>
    </div>
  );
};
