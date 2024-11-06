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
    <div>
      <h3 className="text-2xl">Word phrase</h3>
      <input
        name="mnemonic_phrase"
        defaultValue={mnemonicWords ?? ''}
        onBlur={(e) => onChangeMnemonic(e.target.value)}
      ></input>
      <button onClick={onGenerateMnemonic}>Generate random</button>
    </div>
  );
};
